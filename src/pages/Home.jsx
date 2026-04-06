import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Icon from '../components/Icon'
import destinations from '../data/destinations'
import { Link, useNavigate } from 'react-router-dom'
import { useTrips } from '../lib/TripContext'

/* ─── Parse natural language trip query ─── */
function parseNaturalQuery(query) {
  const q = query.toLowerCase().trim()
  if (!q) return null

  const answers = {
    destination: '',
    duration: '',
    dateStart: '',
    dateEnd: '',
    budget: 50000,
    style: 'Comfortable Mid-range 🏨',
    travelerType: 'Solo 🧍',
    adults: 1,
    children: 0,
    interests: [],
    pace: 'Balanced ⚖️',
    accommodation: 'Hotels 🏨',
    transport: 'No preference',
    foodPrefs: [],
    dietary: '',
    mustVisit: '',
    flexibility: 'Flexible 🔄',
    priorities: [],
    aiOptimize: true
  }

  // Extract destination — match against known destinations
  const knownDests = [
    'jaipur', 'goa', 'kerala', 'varanasi', 'manali', 'ladakh', 'udaipur',
    'agra', 'rishikesh', 'darjeeling', 'hampi', 'mysore', 'coorg', 'shimla',
    'jaisalmer', 'amritsar', 'meghalaya', 'andaman', 'ooty', 'pushkar',
    'jodhpur', 'alleppey', 'pondicherry', 'mount abu', 'mussoorie',
    'delhi', 'mumbai', 'bangalore', 'kolkata', 'chennai', 'hyderabad',
    'pune', 'jaiselmer', 'rajasthan', 'kashmir', 'srinagar', 'leh'
  ]

  for (const dest of knownDests) {
    if (q.includes(dest)) {
      // Find full destination data
      const found = destinations.find(d =>
        d.name.toLowerCase() === dest || d.state.toLowerCase() === dest
      )
      answers.destination = found ? `${found.name}, ${found.state}` : dest.charAt(0).toUpperCase() + dest.slice(1)
      break
    }
  }

  // If no match, try to extract any capitalized word or the main noun
  if (!answers.destination) {
    // Try to find "to X" or "in X" pattern
    const toMatch = query.match(/(?:to|in|at|for)\s+([A-Za-z\s]+?)(?:\s+(?:trip|with|for|in|and|budget|days?|week)|\s*$)/i)
    if (toMatch) {
      answers.destination = toMatch[1].trim()
    } else {
      // Just use the whole query as destination hint
      answers.destination = query.trim()
    }
  }

  // Extract days/duration
  const daysMatch = q.match(/(\d+)\s*(?:days?|nights?|d)/i)
  if (daysMatch) {
    const days = parseInt(daysMatch[1])
    if (days <= 3) answers.duration = `Weekend (${days} days)`
    else if (days <= 6) answers.duration = `Short trip (${days} days)`
    else answers.duration = `Long trip (${days} days)`

    // Auto-set dates
    const start = new Date()
    start.setDate(start.getDate() + 7) // Start a week from now
    const end = new Date(start)
    end.setDate(end.getDate() + days - 1)
    answers.dateStart = start.toISOString().split('T')[0]
    answers.dateEnd = end.toISOString().split('T')[0]
  } else {
    const weekMatch = q.match(/(\d+)\s*weeks?/i)
    if (weekMatch) {
      const days = parseInt(weekMatch[1]) * 7
      answers.duration = `Long trip (${days} days)`
      const start = new Date()
      start.setDate(start.getDate() + 7)
      const end = new Date(start)
      end.setDate(end.getDate() + days - 1)
      answers.dateStart = start.toISOString().split('T')[0]
      answers.dateEnd = end.toISOString().split('T')[0]
    } else {
      // default 3 days
      answers.duration = 'Short trip (3 days)'
      const start = new Date()
      start.setDate(start.getDate() + 7)
      const end = new Date(start)
      end.setDate(end.getDate() + 2)
      answers.dateStart = start.toISOString().split('T')[0]
      answers.dateEnd = end.toISOString().split('T')[0]
    }
  }

  // Extract traveler type
  if (q.includes('friends') || q.includes('friend') || q.includes('group')) {
    answers.travelerType = 'Friends 👯'
    answers.adults = q.match(/(\d+)\s*friends/i)?.[1] ? parseInt(q.match(/(\d+)\s*friends/i)[1]) + 1 : 4
  } else if (q.includes('family') || q.includes('kids') || q.includes('children')) {
    answers.travelerType = 'Family 👨‍👩‍👧'
    answers.adults = 2
    answers.children = 2
  } else if (q.includes('couple') || q.includes('honeymoon') || q.includes('romantic')) {
    answers.travelerType = 'Couple ❤️'
    answers.adults = 2
  } else if (q.includes('solo') || q.includes('alone')) {
    answers.travelerType = 'Solo 🧍'
    answers.adults = 1
  }

  // Extract budget
  const budgetMatch = q.match(/(?:budget|₹|rs\.?|inr)\s*(\d+[,\d]*)/i) || q.match(/(\d{4,})\s*(?:budget|rupees?)/i)
  if (budgetMatch) {
    answers.budget = parseInt(budgetMatch[1].replace(/,/g, ''))
  } else if (q.includes('budget') || q.includes('cheap') || q.includes('backpack')) {
    answers.budget = 15000
    answers.style = 'Budget Backpacking 🎒'
  } else if (q.includes('luxury') || q.includes('premium') || q.includes('5 star')) {
    answers.budget = 150000
    answers.style = 'Luxury Experience ✨'
  }

  // Extract interests
  if (q.includes('adventure') || q.includes('trek') || q.includes('hiking')) answers.interests.push('Adventure 🧗')
  if (q.includes('beach') || q.includes('sea') || q.includes('ocean')) answers.interests.push('Beaches 🏖️')
  if (q.includes('mountain') || q.includes('hill') || q.includes('snow')) answers.interests.push('Mountains 🏔️')
  if (q.includes('food') || q.includes('eat') || q.includes('cuisine') || q.includes('restaurant')) answers.interests.push('Food & Dining 🍜')
  if (q.includes('culture') || q.includes('heritage') || q.includes('temple') || q.includes('history')) answers.interests.push('Culture & History 🏛️')
  if (q.includes('party') || q.includes('nightlife') || q.includes('club')) answers.interests.push('Nightlife 🎉')
  if (q.includes('shopping') || q.includes('market')) answers.interests.push('Shopping 🛍️')
  if (q.includes('nature') || q.includes('wildlife') || q.includes('safari')) answers.interests.push('Nature & Wildlife 🌿')

  // Extract pace
  if (q.includes('relaxed') || q.includes('chill') || q.includes('relax') || q.includes('laid back')) {
    answers.pace = 'Relaxed (few activities, more rest) 😌'
  } else if (q.includes('packed') || q.includes('maximum') || q.includes('explore everything')) {
    answers.pace = 'Packed (maximum exploration) ⚡'
  }

  // Extract accommodation
  if (q.includes('hostel') || q.includes('backpack')) answers.accommodation = 'Hostels 🎒'
  if (q.includes('resort')) answers.accommodation = 'Resorts 🌴'
  if (q.includes('airbnb') || q.includes('homestay')) answers.accommodation = 'Airbnb 🏡'

  return answers
}

/* ─── Example prompts ─── */
const examplePrompts = [
  '4 days Goa trip with friends',
  '3 days Jaipur cultural heritage tour',
  '5 days Kerala backwater honeymoon',
  'Weekend Rishikesh adventure solo',
  '7 days Ladakh bike trip budget',
  'Manali trip with family 4 days'
]

export default function Home() {
  const navigate = useNavigate()
  const { trips, expenses, totalBudget } = useTrips()
  const [heroPrompt, setHeroPrompt] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [isProcessing, setIsProcessing] = useState(false)

  const regions = ['All', 'North India', 'South India', 'West India', 'East India']

  const filteredDestinations = destinations.filter(d => {
    const matchesFilter = filter === 'All' || d.continent === filter
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.state.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Expense tracker stats
  const totalSpent = expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
  const remaining = totalBudget - totalSpent
  const spentPercent = Math.min(100, Math.round((totalSpent / totalBudget) * 100))

  const categoryBreakdown = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.amount || 0)
    return acc
  }, {})

  const handleSmartSearch = () => {
    if (!heroPrompt.trim()) return
    setIsProcessing(true)

    const parsed = parseNaturalQuery(heroPrompt)
    if (parsed && parsed.destination) {
      setTimeout(() => {
        navigate('/itinerary/result', { state: { answers: parsed } })
      }, 1500)
    } else {
      navigate(`/planner?q=${encodeURIComponent(heroPrompt)}`)
    }
  }

  const categoryIcons = {
    'Food & Dining': 'restaurant',
    'Transport': 'commute',
    'Stay': 'hotel',
    'Heritage Shopping': 'shopping_bag'
  }
  const categoryColors = {
    'Food & Dining': '#FF9933',
    'Transport': '#0033A0',
    'Stay': '#8E44AD',
    'Heritage Shopping': '#27AE60'
  }

  return (
    <div className="bg-[#fdf9f3] min-h-screen flex">
      <Sidebar />

      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8 w-full transition-all">
        {/* ─── Smart Hero Section ─── */}
        <section className="relative rounded-[2.5rem] overflow-hidden min-h-[520px] flex items-center justify-center p-8 mb-12 shadow-2xl">
          <img
            className="absolute inset-0 w-full h-full object-cover brightness-[0.6] saturate-[0.8]"
            alt="Hero Background"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeKaM4KE69slvz9e540vYIeDwURv9_0fUREvuZWVCqTF9TY1z6PxlrqisNs3iqrnizbabUa_OVo4NnVCjBRMMxOKgp2Gv0pKaNzetR1uiu1B6_MOAG2mIpPb7aitWQmB9vmu7Z44e2z4L8ZJsYprCUl5DnmslimMeKFzQ2X18Yb2IZe19PRJ0fSgGBezI07yVh7qruXaLzc2ktFGopBZUZ9aZU8nBAKKKkkDKFLS_EBOVTsCyTReZIaLa0yTm13xM-MegI2OMaRfY"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0033A0]/70 via-[#0033A0]/30 to-transparent" />

          <div className="relative z-10 w-full max-w-4xl text-center">
            <h1 className="font-['Noto_Serif'] text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-xl">
              Your AI Trip Planner <br />
              <span className="text-[#FF9933] italic">& Travel Assistant</span>
            </h1>
            <p className="text-white/60 text-sm font-medium mb-8 max-w-xl mx-auto">
              Just type what you want — like <strong className="text-white/90">"4 days Goa trip with friends"</strong> — and NOMAD AI will craft your perfect itinerary instantly.
            </p>

            {isProcessing ? (
              <div className="bg-white/95 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl max-w-2xl mx-auto border border-white/20 text-center space-y-4 animate-pulse">
                <div className="w-16 h-16 bg-[#FF9933]/20 rounded-full flex items-center justify-center mx-auto">
                  <Icon name="auto_awesome" className="text-2xl text-[#FF9933]" filled />
                </div>
                <p className="font-black text-[#0033A0] text-lg">Parsing your request...</p>
                <p className="text-[10px] text-[#00257b]/40 font-bold uppercase tracking-widest">Understanding destination, duration, travelers</p>
              </div>
            ) : (
              <>
                <div className="bg-white/95 backdrop-blur-xl p-2 rounded-[2rem] shadow-2xl flex items-center gap-2 max-w-2xl mx-auto border border-white/20">
                  <Icon name="travel_explore" className="text-[#FF9933] ml-4 text-xl" />
                  <input
                    id="hero-search-input"
                    className="flex-1 bg-transparent px-4 py-4 text-[#0033A0] font-medium outline-none placeholder:text-[#0033A0]/30 text-base"
                    placeholder="e.g. 4 days Goa trip with friends..."
                    value={heroPrompt}
                    onChange={(e) => setHeroPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSmartSearch()}
                  />
                  <button
                    onClick={handleSmartSearch}
                    className="bg-[#0033A0] text-white px-8 py-4 rounded-[1.5rem] font-black flex items-center gap-2 hover:bg-[#0033A0]/90 transition-all active:scale-95 group shrink-0 text-sm uppercase tracking-wider"
                  >
                    <Icon name="auto_awesome" className="text-[#FF9933]" filled />
                    <span className="hidden sm:inline">Generate</span>
                  </button>
                </div>

                {/* Quick Prompt Chips */}
                <div className="flex flex-wrap justify-center gap-2 mt-5 max-w-3xl mx-auto">
                  {examplePrompts.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => { setHeroPrompt(p); }}
                      className="bg-white/15 backdrop-blur-md text-white/80 px-4 py-2 rounded-full text-[11px] font-bold border border-white/10 hover:bg-white/25 hover:text-white transition-all"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* ─── Quick Stats Row ─── */}
        <section className="max-w-7xl mx-auto mb-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/saved-trips" className="bg-white p-5 rounded-[1.5rem] border border-[#00257b]/5 shadow-sm hover:shadow-lg transition-all group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-black text-[#00257b]/20 uppercase tracking-widest">Trips</span>
              <Icon name="bookmark" className="text-[#0033A0] text-sm group-hover:text-[#FF9933] transition-colors" />
            </div>
            <p className="text-2xl font-black text-[#0033A0]">{trips.length}</p>
            <p className="text-[9px] text-[#00257b]/30 font-bold">Saved Trips</p>
          </Link>

          <Link to="/expenses" className="bg-white p-5 rounded-[1.5rem] border border-[#00257b]/5 shadow-sm hover:shadow-lg transition-all group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-black text-[#00257b]/20 uppercase tracking-widest">Spent</span>
              <Icon name="payments" className="text-[#FF9933] text-sm" />
            </div>
            <p className="text-2xl font-black text-[#0033A0]">₹{totalSpent.toLocaleString()}</p>
            <p className="text-[9px] text-[#00257b]/30 font-bold">Total Expenses</p>
          </Link>

          <Link to="/expenses" className="bg-white p-5 rounded-[1.5rem] border border-[#00257b]/5 shadow-sm hover:shadow-lg transition-all group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-black text-[#00257b]/20 uppercase tracking-widest">Budget</span>
              <Icon name="account_balance_wallet" className="text-[#27AE60] text-sm" />
            </div>
            <p className="text-2xl font-black text-[#0033A0]">₹{remaining.toLocaleString()}</p>
            <p className="text-[9px] text-[#00257b]/30 font-bold">Remaining</p>
          </Link>

          <div className="bg-[#0033A0] p-5 rounded-[1.5rem] shadow-lg shadow-[#0033A0]/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Usage</span>
              <span className="text-sm font-black text-[#FF9933]">{spentPercent}%</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-[#FF9933] rounded-full transition-all duration-1000" style={{ width: `${spentPercent}%` }} />
            </div>
            <p className="text-[9px] text-white/40 font-bold">Budget Utilization</p>
          </div>
        </section>

        {/* ─── Expense Tracker + Recent Trips Side-by-Side ─── */}
        <section className="max-w-7xl mx-auto mb-16 grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Recent Trips (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-['Noto_Serif'] font-black text-[#0033A0]">Recent Trips</h2>
              <Link to="/saved-trips" className="text-[#FF9933] font-bold text-xs uppercase tracking-widest hover:underline">View All</Link>
            </div>

            {trips.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {trips.slice(0, 4).map(trip => (
                  <Link key={trip.id} to={`/itinerary/${trip.id}`} className="group bg-white rounded-[1.5rem] overflow-hidden border border-[#00257b]/5 shadow-sm hover:shadow-xl transition-all flex flex-col">
                    <div className="h-36 overflow-hidden relative">
                      <img src={trip.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={trip.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0033A0]/60 to-transparent" />
                      <div className="absolute bottom-3 left-4 text-white">
                        <h3 className="font-bold text-sm group-hover:text-[#FF9933] transition-colors leading-tight">{trip.title}</h3>
                        <p className="text-[9px] font-bold text-white/50 uppercase tracking-wider mt-0.5">{trip.duration} • {(trip.region || '').split(',')[0]}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-[2rem] border border-[#00257b]/5 text-center">
                <Icon name="explore" className="text-4xl text-[#00257b]/10 mb-3" />
                <p className="text-[#00257b]/40 font-bold text-sm">No trips yet. Try the search bar above!</p>
              </div>
            )}
          </div>

          {/* Expense Tracker Widget (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-['Noto_Serif'] font-black text-[#0033A0]">Expense Tracker</h2>
              <Link to="/expenses" className="text-[#FF9933] font-bold text-xs uppercase tracking-widest hover:underline">Details</Link>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-[1.5rem] border border-[#00257b]/5 shadow-sm p-5 space-y-4">
              <h4 className="text-[10px] font-black text-[#00257b]/25 uppercase tracking-widest">Spending by Category</h4>
              {Object.keys(categoryBreakdown).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(categoryBreakdown).sort(([,a],[,b]) => b-a).map(([cat, amt]) => {
                    const pct = totalSpent > 0 ? Math.round((amt / totalSpent) * 100) : 0
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon name={categoryIcons[cat] || 'receipt'} className="text-sm" style={{ color: categoryColors[cat] || '#0033A0' }} />
                            <span className="text-xs font-bold text-[#0033A0]">{cat}</span>
                          </div>
                          <span className="text-xs font-black text-[#00257b]/60">₹{amt.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#00257b]/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${pct}%`, backgroundColor: categoryColors[cat] || '#0033A0' }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-[#00257b]/30 text-xs font-medium text-center py-4">No expenses logged yet</p>
              )}
            </div>

            {/* Recent Expenses */}
            <div className="bg-white rounded-[1.5rem] border border-[#00257b]/5 shadow-sm p-5 space-y-3">
              <h4 className="text-[10px] font-black text-[#00257b]/25 uppercase tracking-widest">Recent Expenses</h4>
              {expenses.length > 0 ? (
                <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar">
                  {expenses.slice(0, 6).map(log => (
                    <div key={log.id} className="flex items-center justify-between py-2 border-b border-[#00257b]/5 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#fdf9f3] rounded-lg flex items-center justify-center">
                          <Icon name={log.icon || 'receipt'} className="text-sm text-[#0033A0]" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#0033A0] leading-tight">{log.title}</p>
                          <p className="text-[9px] text-[#00257b]/30 font-bold uppercase">{log.category}</p>
                        </div>
                      </div>
                      <span className="text-sm font-black text-[#0033A0]">₹{Number(log.amount).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#00257b]/30 text-xs font-medium text-center py-4">No expenses yet</p>
              )}
              <Link to="/expenses" className="block text-center bg-[#0033A0]/5 py-2.5 rounded-xl text-[10px] font-black text-[#0033A0] uppercase tracking-widest hover:bg-[#0033A0]/10 transition-all">
                <Icon name="add" className="text-xs mr-1" />
                Add Expense
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Explore Section ─── */}
        <section className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-4xl font-['Noto_Serif'] font-bold text-[#0033A0] mb-2 tracking-tight">Explore Bharat</h2>
              <p className="text-[#00257b]/60 font-medium">Discover 25 curated destinations for your next adventure.</p>
            </div>

            <div className="relative w-full md:w-64 group">
              <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0033A0]/40 group-focus-within:text-[#FF9933] transition-colors" />
              <input
                id="destination-search-input"
                type="text"
                placeholder="Search destinations..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-[#0033A0]/10 rounded-2xl focus:ring-2 focus:ring-[#FF9933]/20 text-sm font-medium outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Region Filters */}
          <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
            {regions.map(r => (
              <button
                key={r}
                onClick={() => setFilter(r)}
                className={`px-6 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all text-xs tracking-widest uppercase ${
                  filter === r
                  ? 'bg-[#0033A0] text-white shadow-lg shadow-[#0033A0]/20'
                  : 'bg-white text-[#00257b]/60 hover:bg-[#FF9933]/5 border border-[#0033A0]/5'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Destination Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredDestinations.map(d => (
              <Link
                key={d.id}
                to={`/destination/${d.id}`}
                className="group bg-white rounded-3xl overflow-hidden border border-[#00257b]/5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col"
              >
                <div className="aspect-[4/5] relative overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    alt={d.name}
                    src={d.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0033A0]/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <Icon name="star" className="text-[#FF9933] text-xs" filled />
                    <span className="text-[10px] font-black">{d.rating}</span>
                  </div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-xl font-['Noto_Serif'] font-bold leading-tight">{d.name}</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF9933] mt-1">{d.state}</p>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                   <p className="text-sm text-[#00257b]/70 font-medium italic mb-6 line-clamp-2">&quot;{d.tagline}&quot;</p>
                   <div className="mt-auto pt-4 border-t border-[#00257b]/5 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-tighter bg-[#0033A0]/5 text-[#0033A0] px-2 py-1 rounded">{d.budget}</span>
                      <Icon name="arrow_forward" className="text-[#FF9933] translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                   </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredDestinations.length === 0 && (
            <div className="py-20 text-center">
              <Icon name="search_off" className="text-6xl text-[#00257b]/10 mb-4" />
              <p className="text-[#00257b]/40 font-bold uppercase tracking-widest text-sm">No destinations matching your selection</p>
            </div>
          )}
        </section>

        <footer className="mt-32 pt-12 border-t border-[#00257b]/5 text-center pb-8">
             <p className="text-[#00257b]/40 text-xs font-bold uppercase tracking-[0.2em]">NOMAD — Your AI Trip Planner & Travel Assistant</p>
             <p className="text-[#FF9933]/50 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Developed by Utkarsh Chandak • 24BCI0156</p>
        </footer>
      </main>
    </div>
  )
}
