import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Icon from '../components/Icon'
import destinations from '../data/destinations'
import { Link } from 'react-router-dom'

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('All')
  
  const regions = ['All', 'North India', 'South India', 'West India', 'East India']
  
  const filteredDestinations = destinations.filter(d => {
    const matchesFilter = filter === 'All' || d.continent === filter
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.state.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="bg-[#fdf9f3] min-h-screen flex">
      <Sidebar />
      
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8 w-full transition-all">
        <section className="max-w-7xl mx-auto py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="space-y-4">
              <h1 className="text-6xl font-['Noto_Serif'] font-black text-[#0033A0] tracking-tighter">Explore Bharat</h1>
              <p className="text-lg text-[#00257b]/60 font-medium max-w-2xl">
                From spiritual ghats to sapphire shores, dive into 25 curated destinations 
                across the heart of India.
              </p>
            </div>
            
            <div className="relative w-full md:w-80 group">
              <Icon name="search" className="absolute left-5 top-1/2 -translate-y-1/2 text-[#0033A0]/30 group-focus-within:text-[#FF9933] transition-colors" />
              <input
                type="text"
                placeholder="Find your next destination..."
                className="w-full pl-14 pr-6 py-4 bg-white border border-[#0033A0]/5 rounded-3xl shadow-sm focus:ring-4 focus:ring-[#FF9933]/10 text-base font-semibold outline-none transition-all placeholder:text-[#00257b]/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Enhanced Filter Bar */}
          <div className="flex flex-wrap gap-3 mb-16 items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00257b]/40 mr-4">Filter By Region:</span>
            {regions.map(r => (
              <button
                key={r}
                onClick={() => setFilter(r)}
                className={`px-8 py-3 rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all ${
                  filter === r 
                  ? 'bg-[#0033A0] text-white shadow-xl shadow-[#0033A0]/20 scale-105' 
                  : 'bg-white text-[#00257b]/50 hover:bg-[#FF9933]/5 border border-[#00257b]/5'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredDestinations.map(d => (
              <Link
                key={d.id}
                to={`/destination/${d.id}`}
                className="group bg-white rounded-[2rem] overflow-hidden border border-[#00257b]/5 hover:shadow-[0_20px_50px_rgba(0,37,123,0.1)] transition-all duration-700 flex flex-col"
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    alt={d.name}
                    src={d.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#00257b]/90 via-[#00257b]/10 to-transparent opacity-80" />
                  <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xl">
                    <Icon name="star" className="text-[#FF9933] text-xs" filled />
                    <span className="text-xs font-black text-[#00257b]">{d.rating}</span>
                  </div>
                  <div className="absolute bottom-8 left-8 text-white pr-8">
                    <h3 className="text-2xl font-['Noto_Serif'] font-bold leading-tight group-hover:text-[#FF9933] transition-colors">{d.name}</h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/70 mt-2 flex items-center gap-2">
                        <Icon name="location_on" className="text-sm text-[#FF9933]" filled />
                        {d.state}
                    </p>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                   <p className="text-sm text-[#00257b]/70 font-medium leading-relaxed italic mb-8">&quot;{d.tagline}&quot;</p>
                   <div className="mt-auto pt-6 border-t border-[#00257b]/5 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#0033A0] bg-[#FF9933]/10 px-3 py-1.5 rounded-lg border border-[#FF9933]/20">{d.budget}</span>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#00257b]/40 group-hover:text-[#0033A0] transition-colors">
                         <span>View Soul</span>
                         <Icon name="arrow_right_alt" className="text-lg text-[#FF9933]" />
                      </div>
                   </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredDestinations.length === 0 && (
            <div className="py-32 text-center bg-white rounded-[3rem] border border-[#00257b]/5 mt-10 shadow-inner">
              <div className="w-24 h-24 bg-[#FF9933]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="search_off" className="text-4xl text-[#FF9933]" />
              </div>
              <h4 className="text-2xl font-bold text-[#0033A0] mb-2 font-['Noto_Serif']">No paths found</h4>
              <p className="text-[#00257b]/40 font-bold uppercase tracking-widest text-[10px]">Try adjusting your filters or search keywords</p>
            </div>
          )}
        </section>

        <footer className="mt-32 pb-12 text-center">
             <p className="text-[#00257b]/20 text-[10px] font-black uppercase tracking-[0.4em]">Nomad Exploration Hub</p>
        </footer>
      </main>
    </div>
  )
}
