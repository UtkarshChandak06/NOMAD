const NOMAD_SYSTEM = `You are **NOMAD**, an AI-powered Trip Planner & Travel Assistant for India (Bharat).
Tone: warm, respectful, concise. Use clear day-by-day structure when planning trips.
Prefer practical advice: regions, transport modes, approximate INR budgets when relevant, food and culture tips, and safety notes for travelers.
If the user asks for something outside India, politely steer back to Indian travel or give one short general tip then refocus on India.`

/**
 * Calls the secure backend proxy (never the Groq key from the browser).
 * @param {{ messages: { role: 'user'|'assistant', content: string }[], system?: string, temperature?: number }} body
 */
export async function chatWithNomad(body) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system: body.system ?? NOMAD_SYSTEM,
      messages: body.messages,
      temperature: body.temperature ?? 0.65,
      max_tokens: body.max_tokens ?? 4096,
    }),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(typeof data.error === 'string' ? data.error : `Request failed (${res.status})`)
  }
  return { message: data.message ?? '', model: data.model, usage: data.usage }
}

export function buildPreferencesPrompt(prefs) {
  const {
    budgetLabel = 'Premium',
    durationDays = 5,
    travelStyles = ['Cultural'],
    interests = ['Food & Dining', 'History'],
    regionHint = 'Rajasthan',
  } = prefs

  return `Create a rich travel itinerary for India with these constraints:
- Budget tier: ${budgetLabel}
- Duration: ${durationDays} days
- Travel styles: ${travelStyles.join(', ')}
- Interests: ${interests.join(', ')}
- Primary region focus: ${regionHint}

Return: a day-by-day outline (Day 1…), highlights, suggested stays level, food ideas, and rough daily budget notes in INR. Keep it actionable and inspiring.`
}
