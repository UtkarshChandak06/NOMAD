import { useParams, Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Icon from '../components/Icon'
import destinations from '../data/destinations'

export default function DestinationDetail() {
  const { id } = useParams()
  const destination = destinations.find(d => d.id === id)

  if (!destination) {
    return (
      <div className="bg-[#fdf9f3] min-h-screen flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-8 flex items-center justify-center">
            <div className="text-center">
                <Icon name="error" className="text-6xl text-[#d00000]/20 mb-4" />
                <h2 className="text-2xl font-bold text-[#00257b]">Destination Not Found</h2>
                <Link to="/explore" className="text-[#3456c1] font-bold mt-4 inline-block hover:underline">Go back to Explore</Link>
            </div>
        </main>
      </div>
    )
  }

  return (
    <div className="bg-[#fdf9f3] min-h-screen flex">
      <Sidebar />
      
      <main className="flex-1 lg:ml-64 transition-all">
        {/* Hero Section */}
        <section className="relative h-[70vh] w-full flex items-end p-8 md:p-16">
          <img
            className="absolute inset-0 w-full h-full object-cover"
            alt={destination.name}
            src={destination.image}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#00257b] via-[#00257b]/20 to-transparent" />
          
          <div className="relative z-10 w-full max-w-6xl mx-auto space-y-6">
            <Link to="/explore" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-xs font-black uppercase tracking-[0.2em] mb-4">
               <Icon name="arrow_back" className="text-sm" />
               Back to Explore
            </Link>
            <div>
                <h1 className="text-6xl md:text-8xl font-['Noto_Serif'] font-black text-white leading-tight drop-shadow-2xl">
                    {destination.name}
                </h1>
                <p className="text-xl md:text-2xl text-[#FF9933] font-['Noto_Serif'] italic font-medium drop-shadow-lg">
                    &quot;{destination.tagline}&quot;
                </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <div className="max-w-6xl mx-auto px-8 py-20 grid grid-cols-1 lg:grid-cols-3 gap-20">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-16">
                <section>
                    <h2 className="text-3xl font-['Noto_Serif'] font-black text-[#0033A0] mb-6 tracking-tight">The Soul of {destination.name}</h2>
                    <p className="text-lg text-[#00257b]/70 font-medium leading-relaxed">
                        {destination.description}
                    </p>
                </section>

                <section>
                    <h3 className="text-2xl font-['Noto_Serif'] font-black text-[#0033A0] mb-8 flex items-center gap-4">
                        <Icon name="stars" className="text-[#FF9933]" filled />
                        Famous Places to Visit
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {destination.attractions.map((attr, idx) => {
                            const [name, info] = attr.split(' – ')
                            return (
                                <div key={idx} className="group bg-white p-6 rounded-3xl border border-[#00257b]/5 hover:shadow-xl transition-all">
                                    <div className="w-12 h-12 bg-[#FF9933]/10 rounded-2xl flex items-center justify-center text-[#FF9933] mb-4 group-hover:bg-[#FF9933] group-hover:text-white transition-all">
                                        <Icon name="museum" />
                                    </div>
                                    <h4 className="font-bold text-[#0033A0] text-lg mb-1">{name}</h4>
                                    <p className="text-xs text-[#00257b]/50 font-medium leading-relaxed">{info || 'Must-visit spot full of history and charm.'}</p>
                                </div>
                            )
                        })}
                    </div>
                </section>
            </div>

            {/* Right Sidebar Info */}
            <div className="space-y-8">
                <div className="bg-white rounded-[2.5rem] p-8 border border-[#00257b]/5 shadow-sm sticky top-24">
                    <h4 className="text-sm font-black uppercase tracking-widest text-[#00257b]/30 mb-8 border-b border-[#00257b]/5 pb-4">Essential Info</h4>
                    
                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <Icon name="event" className="text-[#FF9933]" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#00257b]/40">Best Time to Visit</p>
                                <p className="font-bold text-[#0033A0]">{destination.bestTime}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Icon name="payments" className="text-[#FF9933]" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#00257b]/40">Daily Budget</p>
                                <p className="font-bold text-[#0033A0]">{destination.avgCost}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Icon name="translate" className="text-[#FF9933]" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#00257b]/40">Primary Language</p>
                                <p className="font-bold text-[#0033A0]">Hindi & Regional</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Icon name="currency_rupee" className="text-[#FF9933]" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#00257b]/40">Currency</p>
                                <p className="font-bold text-[#0033A0]">INR (₹)</p>
                            </div>
                        </div>
                    </div>

                    <Link
                        to={`/planner?q=${encodeURIComponent(destination.name)}`}
                        className="w-full bg-[#0033A0] text-white mt-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl hover:shadow-[0_15px_30px_rgba(0,51,160,0.3)] hover:-translate-y-1 transition-all group"
                    >
                        Plan My {destination.name} Trip
                        <Icon name="auto_awesome" className="text-[#FF9933] group-hover:rotate-12 transition-transform" filled />
                    </Link>
                </div>
            </div>
        </div>

        <footer className="mt-20 py-12 text-center border-t border-[#00257b]/5">
             <p className="text-[#00257b]/20 text-[10px] font-black uppercase tracking-[0.4em]">NOMAD AI • {destination.name}</p>
        </footer>
      </main>
    </div>
  )
}
