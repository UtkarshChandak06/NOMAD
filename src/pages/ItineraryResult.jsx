import { useLocation, useNavigate, Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Icon from '../components/Icon'
import { useTrips } from '../lib/TripContext'
import { useState, useEffect, useMemo, useRef } from 'react'
import { chatWithNomad } from '../lib/ai'
import defaultItineraries from '../data/defaultItineraries'
import destinations from '../data/destinations'

/* Helper: find a matching local image for a destination name */
function getDestinationImage(destName) {
  if (!destName) return null;
  const name = destName.split(',')[0].trim().toLowerCase();
  const match = destinations.find(d => d.name.toLowerCase() === name || d.id === name);
  return match?.image || destinations[0]?.image || null;
}

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
    return JSON.parse(text)
  } catch {
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) {
      try { return JSON.parse(jsonMatch[1].trim()) } catch {}
    }
    const braceMatch = text.match(/\{[\s\S]*\}/)
    if (braceMatch) {
      try { return JSON.parse(braceMatch[0]) } catch {}
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

const getMapLink = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`

export default function ItineraryResult() {
  const location = useLocation()
  const navigate = useNavigate()
  const { addTrip } = useTrips()
  const { answers } = location.state || { answers: {} }
  const [isSaving, setIsSaving] = useState(false)
  const [itinerary, setItinerary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [aiError, setAiError] = useState(null)
  const [regeneratingSlot, setRegeneratingSlot] = useState(null)
  const [showPackingList, setShowPackingList] = useState(false)
  const [packingChecklist, setPackingChecklist] = useState(null)
  const [isGeneratingPacking, setIsGeneratingPacking] = useState(false)
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

      const defaultItin = getDefaultItinerary(answers.destination)

      try {
        const prompt = buildItineraryPrompt(answers)
        const result = await chatWithNomad({
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 3000
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

        if (defaultItin) {
          setItinerary(defaultItin)
        } else {
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
  }, [answers.destination, daysCount])

  const handleRegenerateSlot = async (dayIndex, slotType) => {
    const isMeal = ['breakfast', 'lunch', 'dinner'].includes(slotType)
    setRegeneratingSlot(`${dayIndex}-${slotType}`)
    
    try {
      const prompt = `The user wants to replace the "${slotType}" slot for Day ${dayIndex+1} in ${answers.destination}.
Travel Style: ${answers.style || 'Standard'}, Budget: ${answers.budget || 'Standard'}.
Please suggest a brand NEW alternative ${isMeal ? 'restaurant/food experience' : 'activity/place'}.
Return ONLY valid JSON matching this exact structure:
${isMeal ? `{ "restaurant": "...", "mustTry": "...", "estCost": "₹XXX" }` : `{ "activity": "...", "location": "...", "tip": "..." }`}
No markdown, no explanation.`

      const result = await chatWithNomad({
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.9,
        max_tokens: 1000
      })

      const parsed = parseItineraryJSON(result.message)
      if (parsed && (parsed.activity || parsed.restaurant)) {
        setItinerary(prev => {
          const newDays = [...prev.days]
          newDays[dayIndex] = {
            ...newDays[dayIndex],
            [slotType]: parsed
          }
          return { ...prev, days: newDays }
        })
      } else {
        alert("Couldn't generate a new suggestion. Please try again.")
      }
    } catch (err) {
      console.error(err)
      alert("Failed to regenerate slot: " + err.message)
    } finally {
      setRegeneratingSlot(null)
    }
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
      image: getDestinationImage(answers.destination),
      answers: answers,
      itinerary: itinerary,
      days: itinerary.days.map(d => ({
        day: String(d.dayNumber).padStart(2, '0'),
        title: d.title,
        route: `${d.morning?.activity || ''}, ${d.afternoon?.activity || ''}, ${d.evening?.activity || ''}`,
        food: d.lunch?.mustTry || '',
        cost: d.estimatedDayCost,
        img: getDestinationImage(answers.destination)
      }))
    }

    addTrip(newTrip)
    setTimeout(() => {
      setIsSaving(false)
      navigate('/saved-trips')
    }, 1500)
  }

  const handleGeneratePackingList = async () => {
    if (packingChecklist) {
      setShowPackingList(true)
      return
    }
    setIsGeneratingPacking(true)
    setShowPackingList(true)
    
    try {
      const prompt = `Based on this itinerary to ${answers.destination} for ${daysCount} days, generate a categorized packing checklist.
Include 4 categories (e.g. Clothing, Essentials, Electronics, Toiletries).
Return ONLY JSON in this format: { "categories": [ { "name": "Clothing", "items": ["Item 1", "Item 2"] } ] }`
      
      const result = await chatWithNomad({
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 1000
      })
      const parsed = parseItineraryJSON(result.message)
      if (parsed && parsed.categories) {
        setPackingChecklist(parsed.categories)
      } else {
        throw new Error("Invalid output")
      }
    } catch (err) {
      setPackingChecklist([{name: "Error", items: ["Failed to generate checklist. Please try again."]}])
    } finally {
      setIsGeneratingPacking(false)
    }
  }

  const handleDownloadICS = () => {
    if (!itinerary) return
    
    let icsContent = "BEGIN:VCALENDAR\\nVERSION:2.0\\nPRODID:-//Nomad AI Trip Planner//EN\\n"
    let currentDate = new Date()
    currentDate.setDate(currentDate.getDate() + 1) // Start tomorrow
    
    const formatDate = (date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

    itinerary.days.forEach((day, idx) => {
      const eventDate = new Date(currentDate)
      eventDate.setDate(currentDate.getDate() + idx)
      
      const startDay = new Date(eventDate)
      startDay.setHours(9, 0, 0)
      const endDay = new Date(eventDate)
      endDay.setHours(21, 0, 0)

      icsContent += "BEGIN:VEVENT\\n"
      icsContent += `DTSTART:${formatDate(startDay)}\\n`
      icsContent += `DTEND:${formatDate(endDay)}\\n`
      icsContent += `SUMMARY:Nomad Day ${day.dayNumber} - ${day.title}\\n`
      icsContent += `DESCRIPTION:Morning: ${day.morning?.activity}\\nLunch: ${day.lunch?.restaurant}\\nAfternoon: ${day.afternoon?.activity}\\nDinner: ${day.dinner?.restaurant}\\nHotel: ${day.hotel}\\n`
      icsContent += "END:VEVENT\\n"
    })
    
    icsContent += "END:VCALENDAR"

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.setAttribute('download', `${answers.destination.split(',')[0].replace(/\\s+/g, '_')}-Itinerary.ics`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrint = () => {
    window.print()
  }

  if (!answers.destination) {
    return (
      <div className="bg-[#fdf9f3] min-h-screen flex font-['Inter']">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-8 flex items-center justify-center">
          <div className="text-center">
            <Icon name="explore_off" className="text-6xl text-[#00257b]/10 mb-4" />
            <h2 className="text-2xl font-bold text-[#00257b] font-['Noto_Serif']">No Plan Data Found</h2>
            <Link to="/planner" className="text-[#3456c1] font-bold mt-4 inline-block hover:underline">Start Planning</Link>
          </div>
        </main>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-[#fdf9f3] min-h-screen flex font-['Inter']">
        <Sidebar />
        <main className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center space-y-8 animate-pulse max-w-lg">
            <div className="w-28 h-28 bg-[#FF9933]/20 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-[#FF9933]/10">
              <Icon name="auto_awesome" className="text-5xl text-[#FF9933]" filled />
            </div>
            <h2 className="text-4xl font-black text-[#0033A0] italic font-['Noto_Serif']">
              Crafting your trip...
            </h2>
            <p className="text-[#00257b]/50 font-bold uppercase tracking-[0.3em] text-[11px] font-['Plus_Jakarta_Sans']">
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

  const encodedDestination = encodeURIComponent(answers.destination.split(',')[0]);
  const mapIframeUrl = `https://maps.google.com/maps?q=${encodedDestination}&t=&z=11&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="bg-[#fdf9f3] text-[#001a4d] min-h-screen flex font-['Inter']">
      <Sidebar />
      <main className="flex-1 lg:ml-64 px-4 py-8 lg:px-8 lg:py-12 transition-all max-w-[1440px] mx-auto">
        
        {/* ─── Hero Header ─── */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-16 pt-4">
          <div className="max-w-2xl">
            <nav className="flex gap-2 text-[#FF9933] mb-4 text-xs font-bold tracking-[0.2em] uppercase font-['Plus_Jakarta_Sans']">
              <span className="text-[#00257b]/60">Destinations</span>
              <span className="text-[#00257b]/40">/</span>
              <span>{answers.destination.split(',')[0]}</span>
            </nav>
            <h1 className="text-4xl lg:text-5xl font-bold text-[#0033A0] tracking-tight leading-tight italic font-['Noto_Serif']">
              The Great Voyage: <br/> A {itinerary.totalDays}-Day Odyssey
            </h1>
            <p className="mt-6 text-[#4a5b7d] text-lg max-w-xl leading-relaxed">
              A masterfully curated journey blending historical grandeur with your specific preferences for {answers.style} travel.
            </p>
            {aiError && (
              <p className="text-[11px] text-[#FF9933] font-bold mt-4 bg-[#FF9933]/5 inline-block px-4 py-2 rounded-xl border border-[#FF9933]/10">
                ⚠️ AI temporarily unavailable. Showing a curated default instead.
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleGeneratePackingList}
              className="px-5 py-3 rounded-xl border border-[#FF9933]/20 text-[#FF9933] font-bold hover:bg-[#FF9933]/10 transition-all shadow-sm font-['Plus_Jakarta_Sans'] text-xs uppercase tracking-wider flex items-center gap-2"
            >
              <Icon name="luggage" className="text-[18px]" />
              Checklist
            </button>
            <button
              onClick={handleDownloadICS}
              className="px-5 py-3 rounded-xl border border-[#0033A0]/20 text-[#0033A0] font-bold hover:bg-[#0033A0]/5 transition-all shadow-sm font-['Plus_Jakarta_Sans'] text-xs uppercase tracking-wider flex items-center gap-2"
            >
              <Icon name="event" className="text-[18px]" />
              Save to Calendar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-[#FF9933] text-white px-6 py-3 rounded-xl font-bold hover:brightness-110 transition-all group shadow-lg shadow-[#FF9933]/30 disabled:opacity-50 font-['Plus_Jakarta_Sans'] text-sm uppercase tracking-widest"
            >
              <Icon name={isSaving ? 'hourglass_top' : 'bookmark'} filled={!isSaving} className="group-hover:rotate-6 transition-transform" />
              {isSaving ? 'Saving...' : 'Save Trip'}
            </button>
            <button
              onClick={handlePrint}
              className="p-3 rounded-xl border-2 border-[#0033A0]/10 text-[#0033A0] hover:bg-[#0033A0]/5 transition-all outline-none focus:ring-2 focus:ring-[#0033A0]/20"
            >
              <Icon name="picture_as_pdf" />
            </button>
          </div>
        </div>

        {/* ─── Main Content Layout ─── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-16">
          
          {/* Itinerary Column (Left) */}
          <div className="xl:col-span-7 space-y-12">
            {itinerary.days.map((day, idx) => {
              const dayStr = day.dayNumber || idx + 1;
              const imgSrc = getDestinationImage(answers.destination);
              
              return (
                <div key={idx} className="group relative flex gap-4 md:gap-8">
                  {/* Timeline Node */}
                  <div className="hidden md:flex flex-col items-center">
                    <div className="w-14 h-14 bg-[#0033A0] text-white rounded-2xl flex items-center justify-center font-bold text-xl z-10 shadow-xl shadow-[#0033A0]/20 font-['Plus_Jakarta_Sans'] transform group-hover:scale-110 transition-transform">
                      {String(dayStr).padStart(2, '0')}
                    </div>
                    {idx !== itinerary.days.length - 1 && (
                      <div className="w-px h-full bg-[#0033A0]/10 absolute top-7 left-7 -z-0"></div>
                    )}
                  </div>
                  
                  {/* Day Content Card */}
                  <div className="bg-white p-6 md:p-8 rounded-[2rem] flex flex-col gap-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-[#0033A0]/5 w-full">
                    {/* Header Image & Title */}
                    <div className="flex flex-col md:flex-row gap-8">
                       <div className="md:w-2/5 shrink-0 relative">
                         <img src={imgSrc} alt="Day visual" className="w-full h-48 md:h-full min-h-[12rem] object-cover rounded-2xl shadow-inner bg-slate-100" crossOrigin="anonymous" />
                         <div className="absolute top-3 left-3 md:hidden">
                            <span className="bg-[#0033A0] text-white px-3 py-1 rounded-lg text-xs font-bold font-['Plus_Jakarta_Sans']">Day {dayStr}</span>
                         </div>
                       </div>
                       <div className="flex-1 flex flex-col justify-between">
                         <div>
                           <h3 className="text-2xl font-bold text-[#0033A0] mb-4 leading-tight font-['Noto_Serif']">{day.title}</h3>
                           <div className="space-y-2">
                             <span className="text-[10px] font-black text-[#FF9933] uppercase tracking-[0.2em] font-['Plus_Jakarta_Sans']">Overview</span>
                             <p className="text-sm text-[#4a5b7d] font-medium leading-relaxed">
                               {day.morning?.activity}, {day.afternoon?.activity}, and finishing with {day.evening?.activity}.
                             </p>
                           </div>
                         </div>
                         <div className="flex flex-wrap gap-3 mt-6">
                           <div className="bg-[#f4f0e8] px-4 py-2 rounded-lg flex items-center gap-2 border border-[#0033A0]/5">
                             <Icon name="restaurant" className="text-sm text-[#FF9933]" />
                             <span className="text-[11px] font-bold text-[#0033A0] uppercase tracking-wider truncate max-w-[120px]">{day.lunch?.mustTry || 'Local Cuisine'}</span>
                           </div>
                           <div className="bg-[#FF9933]/10 px-4 py-2 rounded-lg flex items-center gap-2 border border-[#FF9933]/20">
                             <Icon name="payments" className="text-sm text-[#FF9933]" />
                             <span className="text-[11px] font-bold text-[#0033A0] uppercase tracking-wider">{day.estimatedDayCost || 'Cost Varies'}</span>
                           </div>
                         </div>
                       </div>
                    </div>

                    {/* Timeline Slots */}
                    <div className="mt-4 pt-6 border-t border-[#0033A0]/5 space-y-2">
                      <EditableSlot 
                        dayIndex={idx} slotType="morning" emoji="🌅" label="MORNING" color="#0033A0"
                        data={day.morning} isLoading={regeneratingSlot === `${idx}-morning`} onRegenerate={handleRegenerateSlot} answers={answers}
                      />
                      <EditableSlot 
                        dayIndex={idx} slotType="breakfast" emoji="🍳" label="BREAKFAST" color="#FF9933" isMeal bgClass="bg-[#fdf9f3]/50"
                        data={day.breakfast} isLoading={regeneratingSlot === `${idx}-breakfast`} onRegenerate={handleRegenerateSlot} answers={answers}
                      />
                      <EditableSlot 
                        dayIndex={idx} slotType="afternoon" emoji="☀️" label="AFTERNOON" color="#0033A0"
                        data={day.afternoon} isLoading={regeneratingSlot === `${idx}-afternoon`} onRegenerate={handleRegenerateSlot} answers={answers}
                      />
                      <EditableSlot 
                        dayIndex={idx} slotType="lunch" emoji="🥗" label="LUNCH" color="#FF9933" isMeal bgClass="bg-[#fdf9f3]/50"
                        data={day.lunch} isLoading={regeneratingSlot === `${idx}-lunch`} onRegenerate={handleRegenerateSlot} answers={answers}
                      />
                      <EditableSlot 
                        dayIndex={idx} slotType="evening" emoji="🌇" label="EVENING" color="#0033A0"
                        data={day.evening} isLoading={regeneratingSlot === `${idx}-evening`} onRegenerate={handleRegenerateSlot} answers={answers}
                      />
                      <EditableSlot 
                        dayIndex={idx} slotType="dinner" emoji="🍽️" label="DINNER" color="#FF9933" isMeal bgClass="bg-[#fdf9f3]/50"
                        data={day.dinner} isLoading={regeneratingSlot === `${idx}-dinner`} onRegenerate={handleRegenerateSlot} answers={answers}
                      />
                      
                      {day.hotel && (
                        <div className="mt-6 pt-4 border-t border-dashed border-[#0033A0]/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Icon name="hotel" className="text-[#0033A0]" />
                              <span className="text-sm font-bold text-[#0033A0]">Stay: {day.hotel}</span>
                            </div>
                            <a href={getMapLink(day.hotel + ' ' + answers.destination)} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#FF9933] hover:underline flex items-center gap-1">
                                Maps <Icon name="open_in_new" className="text-[14px]" />
                            </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Map Column (Right) */}
          <div className="xl:col-span-5 hidden lg:block">
            <div className="sticky top-28">
              <div className="bg-[#0033A0]/5 rounded-[2.5rem] p-3 shadow-2xl shadow-[#0033A0]/5">
                <div className="bg-white rounded-[2rem] overflow-hidden min-h-[600px] flex flex-col border border-[#0033A0]/10 relative">
                  
                  {/* Map Header */}
                  <div className="p-6 border-b border-[#0033A0]/5 flex justify-between items-center bg-white z-10 relative">
                    <div>
                      <h4 className="font-bold text-[#0033A0] italic text-lg font-['Noto_Serif']">Interactive Route</h4>
                      <p className="text-[10px] text-[#FF9933] font-black uppercase tracking-widest mt-1 font-['Plus_Jakarta_Sans']">Destination Explorer</p>
                    </div>
                    <div className="flex bg-[#f4f0e8] rounded-xl p-1 border border-[#0033A0]/5">
                      <button className="px-4 py-1.5 rounded-lg bg-[#0033A0] text-white text-xs font-bold shadow-md shadow-[#0033A0]/20">Map</button>
                    </div>
                  </div>

                  {/* Live Google Map Iframe */}
                  <div className="flex-1 w-full bg-slate-100 flex-grow rounded-b-[2rem] overflow-hidden">
                     <iframe 
                        title="Destination Map"
                        src={mapIframeUrl}
                        width="100%" 
                        height="100%" 
                        style={{ border: 0, minHeight: '520px' }} 
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                     ></iframe>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* Packing List Modal */}
      {showPackingList && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#001a4d]/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-[#FF9933] text-white p-6 flex justify-between items-center relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold font-['Noto_Serif'] flex items-center gap-2">
                  <Icon name="inventory_2" /> Smart Packing List
                </h3>
                <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-90 mt-1">AI Curated for {answers.destination.split(',')[0]}</p>
              </div>
              <button onClick={() => setShowPackingList(false)} className="relative z-10 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                <Icon name="close" />
              </button>
              <Icon name="luggage" className="absolute -right-4 -bottom-4 text-[100px] text-white/10" filled />
            </div>
            
            <div className="p-6 overflow-y-auto bg-[#fdf9f3] flex-1">
              {isGeneratingPacking ? (
                <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-[#FF9933]/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-[#FF9933] rounded-full border-t-transparent animate-spin"></div>
                    <Icon name="auto_awesome" className="absolute inset-0 m-auto text-[#FF9933]" />
                  </div>
                  <p className="font-bold text-[#0033A0] animate-pulse">Analyzing itinerary & generating checklist...</p>
                </div>
              ) : packingChecklist && packingChecklist[0]?.name === "Error" ? (
                <div className="text-center py-12 text-red-500 font-bold bg-white rounded-2xl border border-red-100 shadow-sm">
                  <Icon name="error" className="text-4xl mb-2 opacity-50" />
                  <p>{packingChecklist[0].items[0]}</p>
                </div>
              ) : packingChecklist ? (
                <div className="space-y-6">
                  {packingChecklist.map((cat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[1.5rem] border border-[#0033A0]/5 shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="font-bold text-[#0033A0] mb-4 flex items-center gap-2 text-lg">
                        <Icon name="check_circle" className="text-[#FF9933]" /> {cat.name}
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#4a5b7d] font-medium">
                        {cat.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-3 bg-[#fdf9f3]/50 p-2 rounded-lg group">
                            <input type="checkbox" className="mt-1 w-4 h-4 rounded border-[#0033A0]/20 text-[#FF9933] focus:ring-[#FF9933] cursor-pointer" />
                            <span className="group-hover:text-[#001a4d] transition-colors">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            
            <div className="bg-white p-4 border-t border-[#0033A0]/5 flex justify-end">
              <button 
                onClick={() => window.print()} 
                disabled={isGeneratingPacking}
                className="px-6 py-2.5 bg-[#0033A0] text-white rounded-xl font-bold font-['Plus_Jakarta_Sans'] text-xs uppercase tracking-wider hover:bg-[#00257b] transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Icon name="print" className="text-[16px]" /> Print List
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

function EditableSlot({ dayIndex, slotType, emoji, label, color, bgClass, isMeal, data, isLoading, onRegenerate, answers }) {
  if (!data || (!data.activity && !data.restaurant)) return null;

  const mainTitle = isMeal ? data.restaurant : data.activity;
  const subline1 = isMeal ? data.mustTry : data.location;
  const subline2 = isMeal ? data.estCost : data.tip;
  
  const locationSearchQuery = `${mainTitle}, ${answers.destination.split(',')[0]}`;

  return (
    <div className={`group flex p-4 rounded-2xl transition-all duration-300 relative border border-transparent hover:border-[#0033A0]/5 hover:bg-[#f4f0e8]/50 overflow-hidden ${bgClass || ''}`}>
      {/* Icon */}
      <div className="w-12 shrink-0 flex flex-col items-center">
        <span className="text-2xl mt-1">{emoji}</span>
      </div>
      
      {/* Details */}
      <div className="flex-1 pl-2 md:pr-20">
        <div className="flex items-center gap-3">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] font-['Plus_Jakarta_Sans']" style={{ color }}>{label}</h4>
        </div>
        
        {isLoading ? (
          <div className="mt-2 space-y-2 animate-pulse w-full">
            <div className="h-4 bg-[#0033A0]/10 w-3/4 rounded-full"></div>
            <div className="h-3 bg-[#0033A0]/5 w-1/2 rounded-full"></div>
            <p className="text-xs text-[#FF9933] italic mt-2 font-bold flex items-center gap-1">
              <Icon name="auto_awesome" className="text-sm" /> AI is finding an alternative...
            </p>
          </div>
        ) : (
          <div className="mt-1">
            <div className="flex items-start justify-between gap-4">
              <h5 className="font-bold text-[#001a4d] text-base leading-snug">{mainTitle}</h5>
            </div>
            {subline1 && (
              <p className="text-sm text-[#4a5b7d] mt-1 pr-6 flex items-start gap-1">
                <Icon name={isMeal ? 'restaurant_menu' : 'location_on'} className="text-[16px] text-[#0033A0]/40 shrink-0 mt-0.5" />
                <span className="truncate md:whitespace-normal">{subline1}</span>
              </p>
            )}
            {subline2 && (
              <p className="text-xs text-[#4a5b7d]/70 mt-1.5 font-medium italic">
                {subline2}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Floating Actions on Hover */}
      {!isLoading && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <a
            href={getMapLink(locationSearchQuery)}
            target="_blank"
            rel="noopener noreferrer"
            title="View on Maps"
            className="w-8 h-8 rounded-full bg-white shadow-md border border-[#0033A0]/10 flex items-center justify-center text-[#FF9933] hover:bg-[#FF9933] hover:text-white transition-colors"
          >
            <Icon name="map" className="text-[16px]" filled />
          </a>
          <button
            onClick={() => onRegenerate(dayIndex, slotType)}
            title="Ask AI for Alternative"
            className="w-8 h-8 rounded-full bg-white shadow-md border border-[#0033A0]/10 flex items-center justify-center text-[#0033A0] hover:bg-[#0033A0] hover:text-white transition-colors"
          >
            <Icon name="autorenew" className="text-[16px]" />
          </button>
        </div>
      )}
    </div>
  )
}
