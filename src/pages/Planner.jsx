import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Icon from '../components/Icon'
import destinations from '../data/destinations'

export default function Planner() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const initialDestination = searchParams.get('q') || ''
  
  const [answers, setAnswers] = useState({
    // 1. Basics
    destination: initialDestination,
    dateStart: '',
    dateEnd: '',
    duration: '', // Auto-calculated
    
    // 2. Budget & Style
    budget: 50000,
    style: 'Comfortable Mid-range 🏨',
    
    // 3. Travelers
    travelerType: 'Solo 🧍',
    adults: 1,
    children: 0,
    
    // 4. Interests
    interests: [],
    pace: 'Balanced ⚖️',
    
    // 5. Stay & Transport
    accommodation: 'Hotels 🏨',
    transport: 'No preference',
    
    // 6. Food
    foodPrefs: [],
    dietary: '',
    
    // 7. Constraints
    mustVisit: '',
    flexibility: 'Flexible 🔄',
    
    // 8. AI Enhancers
    priorities: [],
    aiOptimize: true
  })

  // Auto-calculate duration
  useEffect(() => {
    if (answers.dateStart && answers.dateEnd) {
      const start = new Date(answers.dateStart)
      const end = new Date(answers.dateEnd)
      const diffTime = Math.abs(end - start)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      
      let durText = `${diffDays} Days`
      if (diffDays <= 3) durText = `Weekend (${diffDays} days)`
      else if (diffDays <= 6) durText = `Short trip (${diffDays} days)`
      else durText = `Long trip (${diffDays} days)`
      
      setAnswers(prev => ({ ...prev, duration: durText }))
    }
  }, [answers.dateStart, answers.dateEnd])

  const [isGenerating, setIsGenerating] = useState(false)
  const [destSearch, setDestSearch] = useState(initialDestination)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filteredDestinations = useMemo(() => {
    if (!destSearch) return []
    return destinations.filter(d => 
      d.name.toLowerCase().includes(destSearch.toLowerCase()) || 
      d.state.toLowerCase().includes(destSearch.toLowerCase())
    ).slice(0, 5)
  }, [destSearch])

  const sections = [
    {
      id: 'basics',
      title: 'Trip Basics',
      icon: 'explore',
      questions: [
        { id: 'destination', q: 'Where do you want to go?', type: 'search' },
        { id: 'dates', q: 'When are you traveling?', type: 'dateRange' },
        { id: 'duration', q: 'Trip Duration', type: 'readonly', val: answers.duration || 'Select dates first' }
      ]
    },
    {
      id: 'budget',
      title: 'Budget & Travel Style',
      icon: 'payments',
      questions: [
        { id: 'budget', q: 'What is your budget?', type: 'slider', min: 5000, max: 200000 },
        { id: 'style', q: 'What’s your travel style?', type: 'mcq', options: ['Budget Backpacking 🎒', 'Comfortable Mid-range 🏨', 'Luxury Experience ✨', 'Explorer (mix of everything) 🌍'] }
      ]
    },
    {
      id: 'travelers',
      title: 'Travelers Info',
      icon: 'groups',
      questions: [
        { id: 'travelerType', q: 'Who are you traveling with?', type: 'mcq', options: ['Solo 🧍', 'Couple ❤️', 'Friends 👯', 'Family 👨‍👩‍👧'] },
        { id: 'count', q: 'Number of travelers', type: 'stepper' }
      ]
    },
    {
      id: 'interests',
      title: 'Interests & Activities',
      icon: 'auto_awesome',
      questions: [
        { id: 'interests', q: 'What are you interested in?', type: 'multi', options: ['Adventure 🧗', 'Beaches 🏖️', 'Mountains 🏔️', 'Food & Dining 🍜', 'Culture & History 🏛️', 'Nightlife 🎉', 'Shopping 🛍️', 'Nature & Wildlife 🌿'] },
        { id: 'pace', q: 'Preferred pace of travel', type: 'mcq', options: ['Relaxed (few activities, more rest) 😌', 'Balanced ⚖️', 'Packed (maximum exploration) ⚡'] }
      ]
    },
    {
      id: 'preferences',
      title: 'Stay & Transport Preferences',
      icon: 'hotel',
      questions: [
        { id: 'accommodation', q: 'Preferred accommodation type', type: 'mcq', options: ['Hotels 🏨', 'Hostels 🎒', 'Airbnb 🏡', 'Resorts 🌴'] },
        { id: 'transport', q: 'Transport preference', type: 'mcq', options: ['Public Transport 🚆', 'Rental Vehicle 🚗', 'Flights ✈️', 'No preference'] }
      ]
    },
    {
      id: 'food',
      title: 'Food Preferences',
      icon: 'restaurant',
      questions: [
        { id: 'foodPrefs', q: 'Food preference', type: 'multi', options: ['Vegetarian 🥗', 'Non-Vegetarian 🍗', 'Vegan 🌱', 'Local Cuisine 🍲', 'Fine Dining 🍽️'] },
        { id: 'dietary', q: 'Any dietary restrictions?', type: 'text', placeholder: 'e.g. No dairy, Nut allergy' }
      ]
    },
    {
      id: 'constraints',
      title: 'Constraints & Customization',
      icon: 'tune',
      questions: [
        { id: 'mustVisit', q: 'Any must-visit places?', type: 'text', placeholder: 'e.g. Baga Beach, Eiffel Tower' },
        { id: 'flexibility', q: 'How flexible is your plan?', type: 'mcq', options: ['Fixed itinerary 📌', 'Flexible 🔄'] }
      ]
    },
    {
      id: 'ai',
      title: 'Smart AI Enhancers',
      icon: 'bolt',
      questions: [
        { id: 'priorities', q: 'What matters most to you? (Top 2-3)', type: 'multi-limit', limit: 3, options: ['Budget 💸', 'Comfort 🛏️', 'Experiences 🎯', 'Time efficiency ⏱️'] },
        { id: 'aiOptimize', q: 'Do you want AI to auto-optimize your trip?', type: 'toggle' }
      ]
    }
  ]

  const isFormValid = () => {
    return answers.destination && answers.dateStart && answers.dateEnd
  }

  const handleGenerate = () => {
    if (!isFormValid()) return
    setIsGenerating(true)
    setTimeout(() => {
      navigate('/itinerary/result', { state: { answers } })
    }, 2500)
  }

  // Helper for budget label
  const getBudgetLabel = (val) => {
    if (val < 20000) return 'Low (₹5k–₹20k)'
    if (val < 80000) return 'Medium (₹20k–₹80k)'
    return 'High (₹80k+)'
  }

  useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
      @keyframes progress-indefinite {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      .animate-progress-indefinite {
        animation: progress-indefinite 1.5s infinite linear;
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  return (
    <div className="bg-[#fdf9f3] min-h-screen flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 lg:p-12 pb-32 transition-all">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 animate-pulse">
            <div className="w-24 h-24 bg-[#FF9933]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="auto_awesome" className="text-4xl text-[#FF9933]" filled />
            </div>
            <h2 className="text-4xl font-['Noto_Serif'] font-black text-[#0033A0]">Crafting your trip...</h2>
            <p className="text-[#00257b]/60 font-medium uppercase tracking-[0.3em] text-[10px]">Curating destinations, stays, and flavors</p>
            <div className="w-full max-w-lg h-1.5 bg-[#0033A0]/5 rounded-full overflow-hidden relative">
              <div className="absolute top-0 left-0 h-full w-1/2 bg-[#FF9933] animate-progress-indefinite"></div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto py-12">
            <header className="mb-20">
              <h1 className="text-6xl md:text-8xl font-['Noto_Serif'] font-black text-[#0033A0] tracking-tighter mb-4">Design Your Journey</h1>
              <p className="text-[#00257b]/40 font-bold uppercase tracking-[0.4em] text-xs underline underline-offset-8 decoration-[#FF9933]/30">The Ultimate AI Behavioral Trip Engine</p>
            </header>

            <div className="space-y-32">
              {sections.map((section, sIdx) => (
                <section key={section.id} className="space-y-16">
                  <div className="flex items-center gap-6 border-l-8 border-[#FF9933] pl-8">
                    <div className="p-4 bg-[#FF9933] text-white rounded-2xl shadow-lg shadow-[#FF9933]/20">
                      <Icon name={section.icon} filled />
                    </div>
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00257b]/30 mb-1">Section {sIdx + 1}</h3>
                      <h2 className="text-3xl font-['Noto_Serif'] font-black text-[#0033A0]">{section.title}</h2>
                    </div>
                  </div>

                  <div className="space-y-20 pl-4 md:pl-16">
                    {section.questions.map((q, qIdx) => (
                      <div key={q.id} className="space-y-8 group">
                        <div className="flex items-start gap-4">
                          <span className="text-[10px] font-black text-[#00257b]/10 group-hover:text-[#FF9933] transition-colors mt-1.5">Q{sIdx * 2 + qIdx + 1}</span>
                          <h4 className="text-xl md:text-3xl font-['Noto_Serif'] font-black text-[#0033A0] leading-tight">{q.q}</h4>
                        </div>

                        <div className="md:pl-10">
                          {q.type === 'search' && (
                            <div className="relative">
                              <input
                                type="text"
                                className="w-full bg-transparent border-b-2 border-[#0033A0]/10 focus:border-[#FF9933] py-4 text-2xl font-bold text-[#0033A0] outline-none transition-all placeholder:text-[#0033A0]/10"
                                placeholder="e.g. Goa, India"
                                value={destSearch}
                                onChange={(e) => {
                                  setDestSearch(e.target.value)
                                  setAnswers({ ...answers, destination: e.target.value })
                                  setShowSuggestions(true)
                                }}
                                onFocus={() => setShowSuggestions(true)}
                              />
                              {showSuggestions && filteredDestinations.length > 0 && (
                                <div className="absolute top-full left-0 w-full bg-white rounded-3xl shadow-2xl border border-[#00257b]/5 z-50 overflow-hidden mt-4 animate-in fade-in zoom-in-95 duration-200">
                                  {filteredDestinations.map(d => (
                                    <button
                                      key={d.id}
                                      onClick={() => {
                                        setAnswers({ ...answers, destination: `${d.name}, ${d.state}` })
                                        setDestSearch(`${d.name}, ${d.state}`)
                                        setShowSuggestions(false)
                                      }}
                                      className="w-full text-left p-6 hover:bg-[#fdf9f3] flex items-center justify-between group/dest"
                                    >
                                      <div>
                                        <p className="font-black text-[#0033A0]">{d.name}</p>
                                        <p className="text-[10px] text-[#00257b]/40 uppercase font-bold">{d.state}</p>
                                      </div>
                                      <Icon name="north_east" className="text-[#00257b]/10 group-hover/dest:text-[#FF9933] transition-colors" />
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {q.type === 'dateRange' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-[#00257b]/30">Start Date</label>
                                <input
                                  type="date"
                                  className="w-full bg-white border-2 border-[#00257b]/5 rounded-2xl p-4 font-bold text-[#0033A0] focus:border-[#FF9933] outline-none transition-all"
                                  value={answers.dateStart}
                                  onChange={(e) => setAnswers({ ...answers, dateStart: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-[#00257b]/30">End Date</label>
                                <input
                                  type="date"
                                  className="w-full bg-white border-2 border-[#00257b]/5 rounded-2xl p-4 font-bold text-[#0033A0] focus:border-[#FF9933] outline-none transition-all"
                                  value={answers.dateEnd}
                                  onChange={(e) => setAnswers({ ...answers, dateEnd: e.target.value })}
                                />
                              </div>
                            </div>
                          )}

                          {q.type === 'readonly' && (
                            <div className="inline-flex items-center gap-4 bg-[#FF9933]/5 px-8 py-4 rounded-full border-2 border-[#FF9933]/10">
                              <Icon name="schedule" className="text-[#FF9933]" />
                              <span className="font-black text-[#0033A0] text-lg">{q.val}</span>
                            </div>
                          )}

                          {q.type === 'slider' && (
                            <div className="space-y-6">
                              <input
                                type="range"
                                min={q.min}
                                max={q.max}
                                step="1000"
                                value={answers.budget}
                                onChange={(e) => setAnswers({ ...answers, budget: parseInt(e.target.value) })}
                                className="w-full h-3 bg-[#0033A0]/5 rounded-full appearance-none cursor-pointer accent-[#FF9933]"
                              />
                              <div className="flex justify-between items-center bg-white p-6 rounded-3xl border-2 border-[#00257b]/5">
                                <span className="text-3xl font-black text-[#0033A0]">₹{answers.budget.toLocaleString()}</span>
                                <span className="px-4 py-2 bg-[#FF9933]/10 text-[#FF9933] rounded-xl text-[10px] font-black uppercase tracking-widest">{getBudgetLabel(answers.budget)}</span>
                              </div>
                            </div>
                          )}

                          {q.type === 'stepper' && (
                            <div className="flex gap-8">
                              <div className="flex-1 bg-white p-6 rounded-3xl border-2 border-[#00257b]/5 flex items-center justify-between">
                                <span className="font-bold text-[#00257b]/40 uppercase text-xs">Adults</span>
                                <div className="flex items-center gap-6">
                                  <button onClick={() => setAnswers(prev => ({...prev, adults: Math.max(1, prev.adults - 1)}))} className="w-10 h-10 rounded-xl bg-[#0033A0]/5 flex items-center justify-center hover:bg-[#0033A0] hover:text-white transition-all"><Icon name="remove" /></button>
                                  <span className="text-2xl font-black text-[#0033A0] w-6 text-center">{answers.adults}</span>
                                  <button onClick={() => setAnswers(prev => ({...prev, adults: prev.adults + 1}))} className="w-10 h-10 rounded-xl bg-[#0033A0]/5 flex items-center justify-center hover:bg-[#0033A0] hover:text-white transition-all"><Icon name="add" /></button>
                                </div>
                              </div>
                              <div className="flex-1 bg-white p-6 rounded-3xl border-2 border-[#00257b]/5 flex items-center justify-between">
                                <span className="font-bold text-[#00257b]/40 uppercase text-xs">Children</span>
                                <div className="flex items-center gap-6">
                                  <button onClick={() => setAnswers(prev => ({...prev, children: Math.max(0, prev.children - 1)}))} className="w-10 h-10 rounded-xl bg-[#0033A0]/5 flex items-center justify-center hover:bg-[#0033A0] hover:text-white transition-all"><Icon name="remove" /></button>
                                  <span className="text-2xl font-black text-[#0033A0] w-6 text-center">{answers.children}</span>
                                  <button onClick={() => setAnswers(prev => ({...prev, children: prev.children + 1}))} className="w-10 h-10 rounded-xl bg-[#0033A0]/5 flex items-center justify-center hover:bg-[#0033A0] hover:text-white transition-all"><Icon name="add" /></button>
                                </div>
                              </div>
                            </div>
                          )}

                          {q.type === 'mcq' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {q.options.map(opt => (
                                <button
                                  key={opt}
                                  onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                                  className={`p-6 rounded-[2rem] border-2 font-bold text-left transition-all flex items-center justify-between group/row ${
                                    answers[q.id] === opt 
                                    ? 'bg-[#0033A0] border-[#0033A0] text-white shadow-xl' 
                                    : 'bg-white border-[#00257b]/5 text-[#00257b]/60 hover:border-[#FF9933]/30'
                                  }`}
                                >
                                  {opt}
                                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${answers[q.id] === opt ? 'border-white' : 'border-[#00257b]/10 group-hover/row:border-[#FF9933]/30'}`}>
                                    {answers[q.id] === opt && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}

                          {q.type === 'multi' && (
                            <div className="flex flex-wrap gap-4">
                              {q.options.map(opt => (
                                <button
                                  key={opt}
                                  onClick={() => {
                                    const curr = answers[q.id]
                                    const updated = curr.includes(opt) ? curr.filter(o => o !== opt) : [...curr, opt]
                                    setAnswers({ ...answers, [q.id]: updated })
                                  }}
                                  className={`px-8 py-4 rounded-2xl border-2 font-bold transition-all flex items-center gap-3 ${
                                    answers[q.id].includes(opt) 
                                    ? 'bg-[#FF9933] border-[#FF9933] text-white shadow-lg' 
                                    : 'bg-white border-[#00257b]/5 text-[#00257b]/60 hover:border-[#FF9933]/30'
                                  }`}
                                >
                                  {opt}
                                  {answers[q.id].includes(opt) && <Icon name="check" className="text-sm" />}
                                </button>
                              ))}
                            </div>
                          )}

                          {q.type === 'multi-limit' && (
                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-4">
                                {q.options.map(opt => (
                                    <button
                                    key={opt}
                                    onClick={() => {
                                        const curr = answers[q.id]
                                        if (curr.includes(opt)) {
                                            setAnswers({ ...answers, [q.id]: curr.filter(o => o !== opt) })
                                        } else if (curr.length < q.limit) {
                                            setAnswers({ ...answers, [q.id]: [...curr, opt] })
                                        }
                                    }}
                                    className={`px-8 py-4 rounded-2xl border-2 font-bold transition-all flex items-center gap-3 ${
                                        answers[q.id].includes(opt) 
                                        ? 'bg-[#0033A0] border-[#0033A0] text-white shadow-lg' 
                                        : 'bg-white border-[#00257b]/5 text-[#00257b]/60 hover:border-[#FF9933]/30'
                                    }`}
                                    >
                                    {opt}
                                    {answers[q.id].includes(opt) && <span className="bg-white/20 w-6 h-6 flex items-center justify-center rounded-lg text-[10px]">{answers[q.id].indexOf(opt) + 1}</span>}
                                    </button>
                                ))}
                                </div>
                                <p className="text-[10px] font-bold text-[#00257b]/30 uppercase tracking-widest">Select up to {q.limit} priority factors</p>
                            </div>
                          )}

                          {q.type === 'toggle' && (
                            <button 
                              onClick={() => setAnswers({...answers, [q.id]: !answers[q.id]})}
                              className={`flex items-center gap-6 p-6 rounded-3xl border-2 transition-all ${answers[q.id] ? 'bg-[#FF9933]/5 border-[#FF9933]/20 shadow-inner' : 'bg-white border-[#00257b]/5'}`}
                            >
                              <div className={`w-14 h-8 rounded-full relative transition-colors ${answers[q.id] ? 'bg-[#FF9933]' : 'bg-[#0033A0]/10'}`}>
                                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${answers[q.id] ? 'translate-x-6' : 'translate-x-0'} shadow-sm`} />
                              </div>
                              <span className="font-black text-[#0033A0] text-lg">{answers[q.id] ? 'Yes (Optimized Mode) ✅' : 'No (Manual Control) ❌'}</span>
                            </button>
                          )}

                          {q.type === 'text' && (
                             <input
                                type="text"
                                className="w-full bg-transparent border-b-2 border-[#0033A0]/10 focus:border-[#FF9933] py-4 text-2xl font-bold text-[#0033A0] outline-none transition-all placeholder:text-[#0033A0]/10"
                                placeholder={q.placeholder}
                                value={answers[q.id]}
                                onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-48 pt-24 border-t-4 border-dashed border-[#00257b]/5 flex flex-col items-center">
              <div className="bg-[#FF9933]/5 p-12 rounded-[4rem] text-center max-w-2xl border-2 border-[#FF9933]/10 mb-16">
                 <h3 className="text-4xl font-['Noto_Serif'] font-black text-[#0033A0] mb-6">Ready for your trip?</h3>
                 <p className="text-[#00257b]/60 font-medium leading-relaxed">NOMAD AI is now armed with your preferences. It will craft the perfect itinerary that respects your budget, fuels your passions, and matches your travel style.</p>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!isFormValid()}
                className="bg-[#0033A0] text-white px-20 py-10 rounded-full font-black flex items-center gap-6 hover:bg-[#0033A0]/90 transition-all disabled:opacity-30 shadow-[0_30px_60px_rgba(0,51,160,0.4)] uppercase tracking-[0.4em] text-sm hover:scale-105 active:scale-95 group/gen"
              >
                Generate My Bespoke Itinerary
                <div className="p-2 bg-white/10 rounded-xl group-hover/gen:bg-[#FF9933] transition-colors">
                  <Icon name="auto_awesome" filled className="text-white" />
                </div>
              </button>
              <p className="mt-8 text-[12px] font-bold text-[#00257b]/30 uppercase tracking-[0.6em]">NOMAD — AI Trip Planner</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
