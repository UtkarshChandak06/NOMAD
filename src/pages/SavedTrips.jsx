import { useTrips } from '../lib/TripContext'
import Sidebar from '../components/Sidebar'
import Icon from '../components/Icon'
import { Link } from 'react-router-dom'

export default function SavedTrips() {
  const { trips, removeTrip } = useTrips()

  return (
    <div className="bg-[#fdf9f3] min-h-screen flex">
      <Sidebar />
      
      <main className="flex-1 lg:ml-64 p-4 lg:p-12 transition-all">
        <header className="max-w-6xl mx-auto mb-16 pt-10">
            <h1 className="text-6xl font-['Noto_Serif'] font-black text-[#0033A0] tracking-tighter">Your Trips</h1>
            <p className="text-lg text-[#00257b]/40 font-medium mt-2 uppercase tracking-[0.3em] flex items-center gap-2">
                <Icon name="history" className="text-sm" />
                {trips.length} Curated Journeys
            </p>
        </header>

        <section className="max-w-6xl mx-auto">
            {trips.length === 0 ? (
                <div className="py-32 text-center bg-white rounded-[3rem] border border-[#00257b]/5 shadow-inner">
                    <div className="w-24 h-24 bg-[#0033A0]/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon name="bookmark_border" className="text-4xl text-[#0033A0]/20" />
                    </div>
                    <h2 className="text-2xl font-['Noto_Serif'] font-black text-[#0033A0] mb-2">No trips archived yet</h2>
                    <p className="text-[#00257b]/40 font-bold uppercase tracking-widest text-[10px] mb-8">Your future adventures will appear here</p>
                    <Link to="/planner" className="bg-[#0033A0] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#0033A0]/20 hover:scale-105 transition-all inline-flex items-center gap-2">
                        Plan My First Trip
                        <Icon name="auto_awesome" className="text-[#FF9933]" filled />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {trips.map(trip => (
                        <div key={trip.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-[#00257b]/5 hover:shadow-2xl transition-all duration-700 flex flex-col relative">
                            <Link to={`/itinerary/${trip.id}`} className="flex-1 flex flex-col">
                                <div className="aspect-[16/10] overflow-hidden relative">
                                    <img 
                                        src={trip.image || 'https://image.pollinations.ai/prompt/beautiful%20travel%20destination%20landscape%20photography?width=800&height=600&nologo=true'} 
                                        alt={trip.title} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#00257b]/90 via-[#00257b]/20 to-transparent opacity-80" />
                                    <div className="absolute bottom-6 left-6 text-white pr-12">
                                        <h3 className="text-2xl font-['Noto_Serif'] font-bold leading-tight group-hover:text-[#FF9933] transition-colors">{trip.title}</h3>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mt-2">{trip.duration} • {trip.region}</p>
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-1">
                                    <p className="text-xs text-[#00257b]/60 font-medium leading-relaxed line-clamp-2 italic mb-6">
                                        {trip.style} journey through the heart of Bharat.
                                    </p>
                                    <div className="mt-auto pt-6 border-t border-[#00257b]/5 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#0033A0]">
                                            <span>Relive Journey</span>
                                            <Icon name="arrow_right_alt" className="text-lg text-[#FF9933]" />
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            {/* Delete Action */}
                            <button 
                                onClick={(e) => {
                                    e.preventDefault()
                                    if(window.confirm('Delete this trip permanently?')) removeTrip(trip.id)
                                }}
                                className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:border-red-500 flex items-center justify-center shadow-lg"
                                title="Delete Trip"
                            >
                                <Icon name="delete" className="text-sm" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </section>

        <footer className="mt-32 py-12 text-center border-t border-[#00257b]/5">
             <p className="text-[#00257b]/10 text-[10px] font-black uppercase tracking-[0.6em]">NOMAD — AI Trip Planner</p>
        </footer>
      </main>
    </div>
  )
}
