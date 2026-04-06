import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const DEFAULT_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'
const MAX_MESSAGE_CHARS = 12000
const MAX_MESSAGES = 40

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
  const configured = Boolean(process.env.GROQ_API_KEY)
  res.json({ ok: true, ai: configured ? 'ready' : 'missing_key' })
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

app.post('/api/chat', async (req, res) => {
  const key = process.env.GROQ_API_KEY
  if (!key) {
    return res.status(503).json({
      error: 'AI is not configured. Set GROQ_API_KEY in a .env file on the server (never in the browser).',
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

  const payloadMessages = system?.trim()
    ? [{ role: 'system', content: system.trim() }, ...messages]
    : messages

  try {
    const groqRes = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: payloadMessages,
        temperature: Math.min(2, Math.max(0, Number(temperature) || 0.65)),
        max_tokens: Math.min(8192, Math.max(256, Number(max_tokens) || 4096)),
      }),
    })

    const data = await groqRes.json().catch(() => ({}))

    if (!groqRes.ok) {
      const msg = data?.error?.message || data?.message || 'Groq API error'
      return res.status(groqRes.status >= 400 && groqRes.status < 600 ? groqRes.status : 502).json({
        error: msg,
      })
    }

    const text = data?.choices?.[0]?.message?.content ?? ''
    res.json({
      message: text,
      model: data?.model || DEFAULT_MODEL,
      usage: data?.usage ?? null,
    })
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : 'Server error' })
  }
})

const distPath = path.join(__dirname, 'dist')
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
    console.log(`[nomad] API ${fs.existsSync(distPath) ? '+ static ' : ''}→ http://localhost:${PORT}`)
  })
}
