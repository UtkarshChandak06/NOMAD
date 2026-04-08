import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/* ─── API Endpoints ─── */
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models'
const DEFAULT_GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'
const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash'

const MAX_MESSAGE_CHARS = 12000
const MAX_MESSAGES = 40

/* ─── Determine active provider ─── */
function getProvider() {
  if (process.env.GEMINI_API_KEY) return 'gemini'
  if (process.env.GROQ_API_KEY) return 'groq'
  return null
}

const app = express()
app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  }),
)
app.use(express.json({ limit: '512kb' }))

app.get('/api/health', (_req, res) => {
  const provider = getProvider()
  res.json({ ok: true, ai: provider ? 'ready' : 'missing_key', provider: provider || 'none' })
})

function validateMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return 'messages must be a non-empty array'
  }
  if (messages.length > MAX_MESSAGES) {
    return `too many messages (max ${MAX_MESSAGES})`
  }
  for (const m of messages) {
    if (!m || typeof m !== 'object') return 'invalid message shape'
    if (!['user', 'assistant', 'system'].includes(m.role)) return 'invalid message role'
    if (typeof m.content !== 'string') return 'message content must be a string'
    if (m.content.length > MAX_MESSAGE_CHARS) return 'message too long'
  }
  return null
}

/* ─── Gemini API call ─── */
async function callGemini({ messages, system, temperature, maxTokens }) {
  const key = process.env.GEMINI_API_KEY
  const model = DEFAULT_GEMINI_MODEL
  const url = `${GEMINI_URL}/${model}:generateContent?key=${key}`

  // Convert OpenAI-style messages to Gemini format
  const contents = []
  for (const m of messages) {
    if (m.role === 'system') continue // system handled separately
    contents.push({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })
  }

  const body = {
    contents,
    generationConfig: {
      temperature: Math.min(2, Math.max(0, Number(temperature) || 0.65)),
      maxOutputTokens: Math.min(8192, Math.max(256, Number(maxTokens) || 4096)),
    },
  }

  // Add system instruction if provided
  if (system?.trim()) {
    body.systemInstruction = { parts: [{ text: system.trim() }] }
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const msg = data?.error?.message || 'Gemini API error'
    const status = response.status >= 400 && response.status < 600 ? response.status : 502
    throw { status, message: msg }
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  return {
    message: text,
    model: model,
    usage: data?.usageMetadata ?? null,
  }
}

/* ─── Groq API call ─── */
async function callGroq({ messages, system, temperature, maxTokens }) {
  const key = process.env.GROQ_API_KEY

  const payloadMessages = system?.trim()
    ? [{ role: 'system', content: system.trim() }, ...messages]
    : messages

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: DEFAULT_GROQ_MODEL,
      messages: payloadMessages,
      temperature: Math.min(2, Math.max(0, Number(temperature) || 0.65)),
      max_tokens: Math.min(5000, Math.max(256, Number(maxTokens) || 4096)),
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const msg = data?.error?.message || data?.message || 'Groq API error'
    const status = response.status >= 400 && response.status < 600 ? response.status : 502
    throw { status, message: msg }
  }

  const text = data?.choices?.[0]?.message?.content ?? ''
  return {
    message: text,
    model: data?.model || DEFAULT_GROQ_MODEL,
    usage: data?.usage ?? null,
  }
}

/* ─── Main Chat Endpoint ─── */
app.post('/api/chat', async (req, res) => {
  const provider = getProvider()
  if (!provider) {
    return res.status(503).json({
      error: 'AI is not configured. Set GEMINI_API_KEY or GROQ_API_KEY in a .env file on the server.',
    })
  }

  const { messages, system, temperature = 0.65, max_tokens = 4096 } = req.body || {}

  const err = validateMessages(messages)
  if (err) {
    return res.status(400).json({ error: err })
  }

  if (system != null && typeof system !== 'string') {
    return res.status(400).json({ error: 'system must be a string' })
  }
  if (system && system.length > 8000) {
    return res.status(400).json({ error: 'system prompt too long' })
  }

  try {
    const callArgs = { messages, system, temperature, maxTokens: max_tokens }
    let result

    if (provider === 'gemini') {
      try {
        result = await callGemini(callArgs)
      } catch (geminiErr) {
        // Auto-fallback to Groq if Gemini fails and Groq key exists
        if (process.env.GROQ_API_KEY) {
          console.log(`[nomad] Gemini failed (${geminiErr.message}), falling back to Groq...`)
          result = await callGroq(callArgs)
        } else {
          throw geminiErr
        }
      }
    } else {
      result = await callGroq(callArgs)
    }

    res.json(result)
  } catch (e) {
    const status = e?.status || 500
    const message = e?.message || (e instanceof Error ? e.message : 'Server error')
    res.status(status).json({ error: message })
  }
})

const distPath = path.join(__dirname, '../dist')
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next()
    res.sendFile(path.join(distPath, 'index.html'), (err) => {
      if (err) next(err)
    })
  })
}

export default app;

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = Number(process.env.PORT) || 8787
  app.listen(PORT, () => {
    const p = getProvider()
    console.log(`[nomad] API (${p || 'no AI key'}) ${fs.existsSync(distPath) ? '+ static ' : ''}→ http://localhost:${PORT}`)
  })
}
