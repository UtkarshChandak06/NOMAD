import { Link, useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Icon from '../components/Icon'
import { useTrips } from '../lib/TripContext'
import destinations from '../data/destinations'

export default function Itinerary() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { trips, removeTrip } = useTrips()

  const trip = (id ? trips.find(t => t.id === id) : trips[0])

  if (!trip) {
    return (
      <div className="bg-[#fdf9f3] min-h-screen flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-8 flex items-center justify-center">
          <div className="text-center">
            <Icon name="explore_off" className="text-6xl text-[#00257b]/10 mb-4" />
            <h2 className="text-2xl font-bold text-[#00257b]">No Trips Found</h2>
            <Link to="/planner" className="text-[#3456c1] font-bold mt-4 inline-block hover:underline">Start Planning</Link>
          </div>
        </main>
      </div>
    )
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      removeTrip(trip.id)
      navigate('/saved-trips')
    }
  }

  const handlePrint = () => window.print()

  // Check if trip has detailed itinerary data (new format)
  const hasDetailedItinerary = trip.itinerary && trip.itinerary.days && trip.itinerary.days.length > 0

  return (
    <div className="bg-[#fdf9f3] min-h-screen flex">
      <Sidebar />

      <main className="flex-1 lg:ml-64 transition-all">
        {/* Header Hero */}
        <section className="relative h-[50vh] w-full flex items-end p-8 md:p-12 overflow-hidden">
          <img
            className="absolute inset-0 w-full h-full object-cover"
            src={trip.image || destinations[0]?.image}
            alt={trip.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fdf9f3] via-[#00257b]/40 to-transparent" />

          <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-4">
              <nav className="flex gap-2 text-[#FF9933] text-[10px] font-black tracking-[0.2em] uppercase font-['Plus_Jakarta_Sans']">
                <span className="text-white/60">India</span>
                <span className="text-white/40">/</span>
                <span className="text-white/60">{trip.region}</span>
              </nav>
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight font-['Noto_Serif'] drop-shadow-2xl">
                {trip.title}
              </h1>
              <p className="text-white/80 font-medium italic text-lg">{trip.style} • {trip.duration} journey</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl flex items-center justify-center hover:bg-red-500 hover:border-red-500 transition-all shadow-xl"
              >
                <Icon name="delete" className="text-sm" />
              </button>
              <button
                onClick={handlePrint}
                className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl flex items-center justify-center hover:bg-[#FF9933] hover:border-[#FF9933] transition-all shadow-xl"
              >
                <Icon name="print" className="text-sm" />
              </button>
              <button className="bg-[#0033A0] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 hover:scale-105 transition-all">
                <Icon name="picture_as_pdf" />
                Export
              </button>
            </div>
          </div>
        </section>

        {/* Itinerary Content */}
        <section className="max-w-4xl mx-auto px-8 py-16">
          {hasDetailedItinerary ? (
            /* ─── Detailed Day-by-Day View (new format) ─── */
            <div className="space-y-6">
              {trip.itinerary.days.map((day, idx) => (
                <div key={idx} className="bg-white rounded-[2rem] border border-[#00257b]/5 shadow-sm overflow-hidden hover:shadow-xl transition-shadow duration-500">
                  {/* Day Header */}
                  <div className="bg-gradient-to-r from-[#0033A0] to-[#0033A0]/90 p-6 md:p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white font-black text-xl border border-white/10">
                        {day.dayNumber || idx + 1}
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight font-['Noto_Serif']">
                          DAY {day.dayNumber || idx + 1} — {day.title}
                        </h2>
                        <p className="text-white/50 text-xs font-bold uppercase tracking-widest mt-1">{day.date}</p>
                      </div>
                    </div>
                  </div>

                  {/* Day Content */}
                  <div className="p-6 md:p-8 space-y-0">
                    <TimeSlot emoji="🌅" label="MORNING" color="#FF9933"
                      fields={[
                        { key: 'Activity', val: day.morning?.activity },
                        { key: 'Location', val: day.morning?.location },
                        { key: 'Tip', val: day.morning?.tip }
                      ]}
                    />
                    <SlotDivider />
                    <MealSlot emoji="🍳" label="BREAKFAST" color="#E67E22"
                      fields={[
                        { key: 'Restaurant', val: day.breakfast?.restaurant },
                        { key: 'Must Try', val: day.breakfast?.mustTry },
                        { key: 'Est. Cost', val: day.breakfast?.estCost }
                      ]}
                    />
                    <SlotDivider />
                    <TimeSlot emoji="☀️" label="AFTERNOON" color="#F39C12"
                      fields={[
                        { key: 'Activity', val: day.afternoon?.activity },
                        { key: 'Location', val: day.afternoon?.location },
                        { key: 'Tip', val: day.afternoon?.tip }
                      ]}
                    />
                    <SlotDivider />
                    <MealSlot emoji="🥗" label="LUNCH" color="#27AE60"
                      fields={[
                        { key: 'Restaurant', val: day.lunch?.restaurant },
                        { key: 'Must Try', val: day.lunch?.mustTry },
                        { key: 'Est. Cost', val: day.lunch?.estCost }
                      ]}
                    />
                    <SlotDivider />
                    <TimeSlot emoji="🌇" label="EVENING" color="#8E44AD"
                      fields={[
                        { key: 'Activity', val: day.evening?.activity },
                        { key: 'Location', val: day.evening?.location },
                        { key: 'Tip', val: day.evening?.tip }
                      ]}
                    />
                    <SlotDivider />
                    <MealSlot emoji="🍽️" label="DINNER" color="#C0392B"
                      fields={[
                        { key: 'Restaurant', val: day.dinner?.restaurant },
                        { key: 'Must Try', val: day.dinner?.mustTry },
                        { key: 'Est. Cost', val: day.dinner?.estCost }
                      ]}
                    />

                    {/* Day Footer */}
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
                          <span className="text-[9px] font-black text-[#FF9933] uppercase tracking-widest block">Day Cost</span>
                          <span className="font-black text-[#0033A0] text-lg">{day.estimatedDayCost || '—'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Trip Summary */}
              <div className="bg-white rounded-[2rem] border border-[#00257b]/5 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-[#FF9933] to-[#FF9933]/90 p-6 md:p-8">
                  <h2 className="text-2xl font-black text-white tracking-tight font-['Noto_Serif']">📊 TRIP SUMMARY</h2>
                </div>
                <div className="p-6 md:p-8 space-y-6">
                  <SummaryRow icon="💰" label="Total Estimated Cost" value={trip.itinerary.totalEstimatedCost || '—'} highlight />
                  <SummaryRow icon="🎒" label="Packing Tips" value={trip.itinerary.packingTips || '—'} />
                  <SummaryRow icon="💡" label="General Tips" value={trip.itinerary.generalTips || '—'} />
                  <SummaryRow icon="🚨" label="Emergency Contacts" value={trip.itinerary.emergencyContacts || 'Police: 100 | Ambulance: 108'} />
                </div>
              </div>
            </div>
          ) : trip.days && trip.days.length > 0 ? (
            /* ─── Legacy card-based view (old format) ─── */
            <div className="space-y-20">
              {trip.days.map((d, idx) => (
                <div key={idx} className="group relative flex gap-8 md:gap-16">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-white border border-[#00257b]/5 rounded-[1.5rem] flex items-center justify-center text-2xl font-black text-[#0033A0] shadow-xl group-hover:bg-[#0033A0] group-hover:text-white transition-all z-10">
                      {d.day}
                    </div>
                    <div className="w-1 h-full bg-[#00257b]/5 absolute top-16 rounded-full" />
                  </div>

                  <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-[#00257b]/5 shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col lg:flex-row gap-10 flex-1">
                    <div className="lg:w-1/2 overflow-hidden rounded-[2.5rem] shadow-inner">
                      <img src={d.img} alt={d.title} className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-1000" />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-6">
                        <h3 className="text-3xl font-['Noto_Serif'] font-black text-[#0033A0] leading-tight">{d.title}</h3>
                        <div className="p-6 bg-[#fdf9f3] rounded-3xl border border-[#00257b]/5">
                          <span className="text-[10px] font-black text-[#FF9933] uppercase tracking-[0.2em] block mb-2">Curated Route</span>
                          <p className="text-[#00257b]/70 font-medium leading-relaxed">{d.route}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t border-[#00257b]/5">
                        <div className="flex items-center gap-3 bg-[#0033A0]/5 px-5 py-3 rounded-2xl">
                          <Icon name="restaurant" className="text-[#FF9933]" />
                          <span className="text-xs font-bold text-[#0033A0]">{d.food}</span>
                        </div>
                        <div className="flex items-center gap-3 bg-[#FF9933]/10 px-5 py-3 rounded-2xl">
                          <Icon name="payments" className="text-[#FF9933]" />
                          <span className="text-xs font-bold text-[#0033A0]">{d.cost}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-16 rounded-[3rem] border border-[#00257b]/5 shadow-sm text-center max-w-3xl mx-auto space-y-6">
              <Icon name="auto_awesome" className="text-5xl text-[#FF9933]" filled />
              <h2 className="text-3xl font-['Noto_Serif'] font-black text-[#0033A0]">AI Manifestation</h2>
              <p className="text-lg text-[#00257b]/60 leading-relaxed italic whitespace-pre-wrap px-8">
                {trip.content}
              </p>
            </div>
          )}
        </section>

        <footer className="mt-12 py-12 text-center border-t border-[#00257b]/5">
          <p className="text-[#00257b]/10 text-[10px] font-black uppercase tracking-[0.6em]">NOMAD — AI Trip Planner & Travel Assistant</p>
        </footer>
      </main>
    </div>
  )
}


/* ─── Shared Sub-components ─── */

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
