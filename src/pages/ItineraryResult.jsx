import { useLocation, useNavigate, Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Icon from '../components/Icon'
import { useTrips } from '../lib/TripContext'
import { useState, useEffect, useMemo, useRef } from 'react'
import { chatWithNomad } from '../lib/ai'
import defaultItineraries from '../data/defaultItineraries'

/* ─── AI Prompt for structured itinerary ─── */
function buildItineraryPrompt(answers) {
  const dest = answers.destination || 'Jaipur, Rajasthan'
  const daysMatch = answers.duration?.match(/\d+/)
  const numDays = daysMatch ? parseInt(daysMatch[0]) : 3

  return `Create a detailed ${numDays}-day travel itinerary for ${dest}, India.

User preferences:
- Budget: ₹${(answers.budget || 50000).toLocaleString()} total
- Travel style: ${answers.style || 'Comfortable Mid-range'}
- Travelers: ${answers.adults || 1} adults, ${answers.children || 0} children
- Interests: ${(answers.interests || []).join(', ') || 'General sightseeing'}
- Food preferences: ${(answers.foodPrefs || []).join(', ') || 'Local cuisine'}
- Accommodation: ${answers.accommodation || 'Hotels'}
- Pace: ${answers.pace || 'Balanced'}
${answers.mustVisit ? `- Must visit: ${answers.mustVisit}` : ''}

IMPORTANT: Respond ONLY with valid JSON. No markdown, no code fences, no explanation.

Use this exact JSON structure:
{
  "destination": "${dest}",
  "totalDays": ${numDays},
  "totalEstimatedCost": "₹XX,XXX",
  "packingTips": "...",
  "generalTips": "...",
  "emergencyContacts": "Police: 100 | Ambulance: 108 | ...",
  "days": [
    {
      "dayNumber": 1,
      "title": "Day Title Here",
      "date": "Day 1",
      "morning": { "activity": "...", "location": "...", "tip": "..." },
      "breakfast": { "restaurant": "...", "mustTry": "...", "estCost": "₹XXX" },
      "afternoon": { "activity": "...", "location": "...", "tip": "..." },
      "lunch": { "restaurant": "...", "mustTry": "...", "estCost": "₹XXX" },
      "evening": { "activity": "...", "location": "...", "tip": "..." },
      "dinner": { "restaurant": "...", "mustTry": "...", "estCost": "₹XXX" },
      "hotel": "Hotel Name",
      "estimatedDayCost": "₹X,XXX"
    }
  ]
}

Make it realistic with real restaurant names, real locations, real costs in INR. Be specific and practical.`
}

/* ─── Parse AI response ─── */
function parseItineraryJSON(text) {
  try {
    // Try direct parse
    return JSON.parse(text)
  } catch {
    // Try extracting JSON from markdown code fences
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) {
      try { return JSON.parse(jsonMatch[1].trim()) } catch { /* fall through */ }
    }
    // Try finding JSON object in text
    const braceMatch = text.match(/\{[\s\S]*\}/)
    if (braceMatch) {
      try { return JSON.parse(braceMatch[0]) } catch { /* fall through */ }
    }
    return null
  }
}

/* ─── Find default itinerary for destination ─── */
function getDefaultItinerary(destination) {
  if (!destination) return null
  const destLower = destination.toLowerCase()
  for (const [key, val] of Object.entries(defaultItineraries)) {
    if (destLower.includes(key)) return val
  }
  return null
}


export default function ItineraryResult() {
  const location = useLocation()
  const navigate = useNavigate()
  const { addTrip } = useTrips()
  const { answers } = location.state || { answers: {} }
  const [isSaving, setIsSaving] = useState(false)
  const [itinerary, setItinerary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [aiError, setAiError] = useState(null)
  const hasFetched = useRef(false)

  const daysCount = useMemo(() => {
    if (!answers.duration) return 3
    const match = answers.duration.match(/\d+/)
    return match ? parseInt(match[0]) : 3
  }, [answers.duration])

  const totalTravelers = (answers.adults || 1) + (answers.children || 0)

  /* ─── Fetch itinerary on mount ─── */
  useEffect(() => {
    if (!answers.destination || hasFetched.current) return
    hasFetched.current = true

    async function fetchItinerary() {
      setLoading(true)
      setAiError(null)

      // First try: check for default itinerary
      const defaultItin = getDefaultItinerary(answers.destination)

      try {
        const prompt = buildItineraryPrompt(answers)
        const result = await chatWithNomad({
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 8192
        })

        const parsed = parseItineraryJSON(result.message)
        if (parsed && parsed.days && parsed.days.length > 0) {
          setItinerary(parsed)
          setLoading(false)
          return
        }
        throw new Error('Invalid AI response format')
      } catch (err) {
        console.warn('AI itinerary generation failed:', err.message)
        setAiError(err.message)

        // Fallback to default itinerary
        if (defaultItin) {
          setItinerary(defaultItin)
        } else {
          // Generate a basic fallback from the first available default
          const fallback = Object.values(defaultItineraries)[0]
          if (fallback) {
            setItinerary({
              ...fallback,
              destination: answers.destination,
              totalDays: daysCount
            })
          }
        }
      }
      setLoading(false)
    }

    fetchItinerary()
  }, [answers.destination])

  if (!answers.destination) {
    return (
      <div className="bg-[#fdf9f3] min-h-screen flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-8 flex items-center justify-center">
          <div className="text-center">
            <Icon name="explore_off" className="text-6xl text-[#00257b]/10 mb-4" />
            <h2 className="text-2xl font-bold text-[#00257b]">No Plan Data Found</h2>
            <Link to="/planner" className="text-[#3456c1] font-bold mt-4 inline-block hover:underline">Start Planning</Link>
          </div>
        </main>
      </div>
    )
  }

  const handleSave = () => {
    if (!itinerary) return
    setIsSaving(true)

    const newTrip = {
      id: crypto.randomUUID(),
      title: `${answers.destination.split(',')[0]} Odyssey`,
      region: answers.destination,
      duration: answers.duration,
      style: answers.style,
      image: `https://source.unsplash.com/800x600/?${encodeURIComponent(answers.destination.split(',')[0])},travel`,
      answers: answers,
      itinerary: itinerary,
      days: itinerary.days.map(d => ({
        day: String(d.dayNumber).padStart(2, '0'),
        title: d.title,
        route: `${d.morning.activity}, ${d.afternoon.activity}, ${d.evening.activity}`,
        food: d.lunch.mustTry,
        cost: d.estimatedDayCost,
        img: `https://source.unsplash.com/800x600/?${encodeURIComponent(answers.destination.split(',')[0])},day${d.dayNumber}`
      }))
    }

    addTrip(newTrip)
    setTimeout(() => {
      setIsSaving(false)
      navigate('/saved-trips')
    }, 1500)
  }

  const handlePrint = () => {
    window.print()
  }

  /* ─── Loading State ─── */
  if (loading) {
    return (
      <div className="bg-[#fdf9f3] min-h-screen flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center space-y-8 animate-pulse max-w-lg">
            <div className="w-28 h-28 bg-[#FF9933]/20 rounded-full flex items-center justify-center mx-auto">
              <Icon name="auto_awesome" className="text-5xl text-[#FF9933]" filled />
            </div>
            <h2 className="text-4xl font-black text-[#0033A0]" style={{ fontFamily: 'Noto Serif, serif' }}>
              Crafting your trip...
            </h2>
            <p className="text-[#00257b]/50 font-bold uppercase tracking-[0.3em] text-[11px]">
              Our AI is curating activities, restaurants, and hidden gems
            </p>
            <div className="w-full h-2 bg-[#0033A0]/5 rounded-full overflow-hidden relative">
              <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-[#FF9933] to-[#0033A0] rounded-full" style={{ animation: 'shimmer 1.5s infinite linear' }} />
            </div>
            <style>{`
              @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(200%); }
              }
            `}</style>
          </div>
        </main>
      </div>
    )
  }

  if (!itinerary) return null

  return (
    <div className="bg-[#fdf9f3] min-h-screen flex">
      <Sidebar />

      <main className="flex-1 lg:ml-64 p-4 lg:p-12 transition-all">
        {/* ─── Header ─── */}
        <header className="max-w-4xl mx-auto mb-12 pt-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-[#FF9933]/10 text-[#FF9933] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-[#FF9933]/20">
              {aiError ? '📋 Default Itinerary' : '✨ AI Generated Itinerary'}
            </span>
            <span className="bg-[#0033A0]/5 text-[#0033A0]/40 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
              {answers.duration || `${daysCount} Days`}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-[#0033A0] leading-tight mb-3" style={{ fontFamily: 'Noto Serif, serif' }}>
            {answers.destination.split(',')[0]} <br />
            <span className="text-[#00257b]/25">Chronicle</span>
          </h1>
          {aiError && (
            <p className="text-[11px] text-[#FF9933] font-bold mt-2 bg-[#FF9933]/5 inline-block px-4 py-2 rounded-xl border border-[#FF9933]/10">
              ⚠️ AI unavailable — showing curated default. {aiError.includes('key') ? 'Check your GROQ_API_KEY.' : ''}
            </p>
          )}
        </header>

        {/* ─── Travel Signals Summary ─── */}
        <section className="max-w-4xl mx-auto mb-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Style', val: answers.style, icon: 'style' },
            { label: 'Pace', val: answers.pace, icon: 'speed' },
            { label: 'Stay', val: answers.accommodation, icon: 'hotel' },
            { label: 'Budget', val: `₹${(answers.budget || 50000).toLocaleString()}`, icon: 'payments' }
          ].map((sig, idx) => (
            <div key={idx} className="bg-white p-5 rounded-[1.5rem] border border-[#00257b]/5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-[#00257b]/20 uppercase tracking-widest">{sig.label}</span>
                <Icon name={sig.icon} className="text-[#FF9933] text-sm" />
              </div>
              <p className="font-black text-[#0033A0] text-sm truncate">{sig.val || '—'}</p>
            </div>
          ))}
        </section>

        {/* ─── Day-by-Day Itinerary ─── */}
        <section className="max-w-4xl mx-auto space-y-6 pb-12">
          {itinerary.days.map((day, idx) => (
            <div key={idx} className="bg-white rounded-[2rem] border border-[#00257b]/5 shadow-sm overflow-hidden hover:shadow-xl transition-shadow duration-500">
              {/* Day Header */}
              <div className="bg-gradient-to-r from-[#0033A0] to-[#0033A0]/90 p-6 md:p-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white font-black text-xl border border-white/10">
                    {day.dayNumber || idx + 1}
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-white tracking-tight" style={{ fontFamily: 'Noto Serif, serif' }}>
                      DAY {day.dayNumber || idx + 1} — {day.title}
                    </h2>
                    <p className="text-white/50 text-xs font-bold uppercase tracking-widest mt-1">{day.date}</p>
                  </div>
                </div>
              </div>

              {/* Day Content */}
              <div className="p-6 md:p-8 space-y-0">
                {/* Morning */}
                <TimeSlot
                  emoji="🌅"
                  label="MORNING"
                  color="#FF9933"
                  fields={[
                    { key: 'Activity', val: day.morning?.activity },
                    { key: 'Location', val: day.morning?.location },
                    { key: 'Tip', val: day.morning?.tip }
                  ]}
                />

                <SlotDivider />

                {/* Breakfast */}
                <MealSlot
                  emoji="🍳"
                  label="BREAKFAST"
                  color="#E67E22"
                  fields={[
                    { key: 'Restaurant', val: day.breakfast?.restaurant },
                    { key: 'Must Try', val: day.breakfast?.mustTry },
                    { key: 'Est. Cost', val: day.breakfast?.estCost }
                  ]}
                />

                <SlotDivider />

                {/* Afternoon */}
                <TimeSlot
                  emoji="☀️"
                  label="AFTERNOON"
                  color="#F39C12"
                  fields={[
                    { key: 'Activity', val: day.afternoon?.activity },
                    { key: 'Location', val: day.afternoon?.location },
                    { key: 'Tip', val: day.afternoon?.tip }
                  ]}
                />

                <SlotDivider />

                {/* Lunch */}
                <MealSlot
                  emoji="🥗"
                  label="LUNCH"
                  color="#27AE60"
                  fields={[
                    { key: 'Restaurant', val: day.lunch?.restaurant },
                    { key: 'Must Try', val: day.lunch?.mustTry },
                    { key: 'Est. Cost', val: day.lunch?.estCost }
                  ]}
                />

                <SlotDivider />

                {/* Evening */}
                <TimeSlot
                  emoji="🌇"
                  label="EVENING"
                  color="#8E44AD"
                  fields={[
                    { key: 'Activity', val: day.evening?.activity },
                    { key: 'Location', val: day.evening?.location },
                    { key: 'Tip', val: day.evening?.tip }
                  ]}
                />

                <SlotDivider />

                {/* Dinner */}
                <MealSlot
                  emoji="🍽️"
                  label="DINNER"
                  color="#C0392B"
                  fields={[
                    { key: 'Restaurant', val: day.dinner?.restaurant },
                    { key: 'Must Try', val: day.dinner?.mustTry },
                    { key: 'Est. Cost', val: day.dinner?.estCost }
                  ]}
                />

                {/* Day Footer — Hotel & Cost */}
                <div className="mt-6 pt-6 border-t-2 border-dashed border-[#00257b]/5 flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🏨</span>
                    <div>
                      <span className="text-[9px] font-black text-[#00257b]/25 uppercase tracking-widest block">Stay Tonight</span>
                      <span className="font-bold text-[#0033A0] text-sm">{day.hotel || '—'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-[#FF9933]/5 px-5 py-3 rounded-2xl border border-[#FF9933]/10">
                    <span className="text-lg">💰</span>
                    <div>
                      <span className="text-[9px] font-black text-[#FF9933] uppercase tracking-widest block">Estimated Day Cost</span>
                      <span className="font-black text-[#0033A0] text-lg">{day.estimatedDayCost || '—'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* ─── Trip Summary ─── */}
        <section className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-[2rem] border border-[#00257b]/5 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#FF9933] to-[#FF9933]/90 p-6 md:p-8">
              <h2 className="text-2xl font-black text-white tracking-tight" style={{ fontFamily: 'Noto Serif, serif' }}>
                📊 TRIP SUMMARY
              </h2>
            </div>
            <div className="p-6 md:p-8 space-y-6">
              <SummaryRow icon="💰" label="Total Estimated Cost" value={itinerary.totalEstimatedCost || '—'} highlight />
              <SummaryRow icon="🎒" label="Packing Tips" value={itinerary.packingTips || '—'} />
              <SummaryRow icon="💡" label="General Tips" value={itinerary.generalTips || '—'} />
              <SummaryRow icon="🚨" label="Emergency Contacts" value={itinerary.emergencyContacts || 'Police: 100 | Ambulance: 108 | Tourism: 1363'} />
            </div>
          </div>
        </section>

        {/* ─── Action Buttons ─── */}
        <section className="max-w-4xl mx-auto pb-20">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#0033A0] text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-[#0033A0]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
            >
              <Icon name={isSaving ? 'hourglass_top' : 'bookmark_add'} filled />
              {isSaving ? 'Saving...' : 'Save Trip'}
            </button>
            <button
              onClick={() => navigate('/planner', { state: { answers } })}
              className="bg-white text-[#0033A0] px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] border-2 border-[#0033A0]/10 hover:border-[#0033A0]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            >
              <Icon name="edit" />
              Edit Plan
            </button>
            <button
              onClick={handlePrint}
              className="bg-white text-[#FF9933] px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] border-2 border-[#FF9933]/10 hover:border-[#FF9933]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            >
              <Icon name="print" />
              Print
            </button>
          </div>
        </section>

        {/* Travelers Footer */}
        <footer className="py-12 text-center border-t border-[#00257b]/5">
          <div className="inline-flex items-center gap-4 px-8 py-3 bg-white rounded-full border border-[#00257b]/5 shadow-sm mb-6">
            <div className="flex -space-x-3">
              {Array.from({ length: Math.min(totalTravelers, 3) }).map((_, i) => (
                <div key={i} className="w-9 h-9 rounded-full bg-[#0033A0] border-3 border-white flex items-center justify-center text-white text-[9px] font-bold">
                  {i === 0 ? 'YOU' : 'TR'}
                </div>
              ))}
              {totalTravelers > 3 && (
                <div className="w-9 h-9 rounded-full bg-[#FF9933] border-3 border-white flex items-center justify-center text-white text-[9px] font-bold">
                  +{totalTravelers - 3}
                </div>
              )}
            </div>
            <p className="text-[9px] font-bold text-[#00257b]/40 uppercase tracking-widest">
              Crafted by NOMAD AI for {totalTravelers} traveler{totalTravelers > 1 ? 's' : ''}
            </p>
          </div>
          <p className="text-[#00257b]/10 text-[10px] font-black uppercase tracking-[0.6em]">NOMAD — AI Trip Planner & Travel Assistant</p>
        </footer>
      </main>
    </div>
  )
}


/* ─── Sub-components ─── */

function TimeSlot({ emoji, label, color, fields }) {
  return (
    <div className="py-4">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xl">{emoji}</span>
        <h3 className="text-xs font-black uppercase tracking-[0.2em]" style={{ color }}>{label}</h3>
      </div>
      <div className="pl-9 space-y-1.5">
        {fields.map((f, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-[11px] font-bold text-[#00257b]/30 uppercase min-w-[70px] shrink-0">{f.key}:</span>
            <span className="text-[13px] text-[#00257b]/80 font-medium leading-relaxed">{f.val || '—'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MealSlot({ emoji, label, color, fields }) {
  return (
    <div className="py-4 bg-[#fdf9f3]/50 rounded-2xl px-4 -mx-2">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xl">{emoji}</span>
        <h3 className="text-xs font-black uppercase tracking-[0.2em]" style={{ color }}>{label}</h3>
      </div>
      <div className="pl-9 space-y-1.5">
        {fields.map((f, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-[11px] font-bold text-[#00257b]/30 uppercase min-w-[70px] shrink-0">{f.key}:</span>
            <span className="text-[13px] text-[#00257b]/80 font-medium leading-relaxed">{f.val || '—'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SlotDivider() {
  return <div className="border-b border-[#00257b]/5 mx-4" />
}

function SummaryRow({ icon, label, value, highlight }) {
  return (
    <div className={`flex items-start gap-4 ${highlight ? 'bg-[#FF9933]/5 p-5 rounded-2xl border border-[#FF9933]/10' : 'pb-4 border-b border-[#00257b]/5 last:border-0'}`}>
      <span className="text-xl shrink-0">{icon}</span>
      <div className="flex-1">
        <span className="text-[9px] font-black text-[#00257b]/25 uppercase tracking-widest block mb-1">{label}</span>
        <p className={`font-medium leading-relaxed ${highlight ? 'font-black text-[#0033A0] text-xl' : 'text-[#00257b]/70 text-sm'}`}>
          {value}
        </p>
      </div>
    </div>
  )
}
