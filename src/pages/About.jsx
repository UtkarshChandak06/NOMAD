import Sidebar from '../components/Sidebar'
import Icon from '../components/Icon'

export default function About() {
  return (
    <div className="min-h-screen bg-[#fdf9f3] flex text-[#00257b] font-['Plus_Jakarta_Sans']">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-8 lg:p-12 overflow-y-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-['Noto_Serif'] font-black text-[#0033A0]">About Project</h1>
          <p className="text-[#00257b]/60 mt-2 font-medium">Problem Statement & Description</p>
        </header>

        <div className="max-w-4xl mx-auto space-y-12 pb-24">
          
          {/* Section 1 */}
          <section className="bg-white p-8 lg:p-12 rounded-[2.5rem] border border-[#00257b]/5 shadow-sm">
            <h2 className="text-2xl font-['Noto_Serif'] font-bold text-[#0033A0] mb-8 flex items-center gap-4">
              <span className="w-10 h-10 rounded-full bg-[#FF9933]/10 text-[#FF9933] flex items-center justify-center text-lg font-black">1</span>
              Given Problem Statement
            </h2>
            <div className="space-y-6 text-[#00257b]/80 leading-relaxed font-medium">
              <p>Modern travelers face difficulty in planning trips efficiently due to scattered information across multiple platforms. Traditional travel planners require manual input, lack personalization, and do not adapt dynamically to user preferences, budget constraints, or real-time changes.</p>
              <p>The problem is to develop an intelligent system that simplifies trip planning by:</p>
              <ul className="list-disc pl-6 space-y-3 marker:text-[#FF9933]">
                <li>Reducing manual effort</li>
                <li>Providing personalized recommendations</li>
                <li>Generating structured itineraries</li>
                <li>Assisting users throughout their travel journey</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-white p-8 lg:p-12 rounded-[2.5rem] border border-[#00257b]/5 shadow-sm">
            <h2 className="text-2xl font-['Noto_Serif'] font-bold text-[#0033A0] mb-8 flex items-center gap-4">
              <span className="w-10 h-10 rounded-full bg-[#FF9933]/10 text-[#FF9933] flex items-center justify-center text-lg font-black">2</span>
              Problem Description
            </h2>
            <div className="space-y-8 text-[#00257b]/80 leading-relaxed font-medium">
              <p>Existing travel planning solutions are mostly static and user-driven, requiring individuals to:</p>
              <ul className="list-disc pl-6 space-y-3 marker:text-[#FF9933]">
                <li>Search destinations manually</li>
                <li>Compare multiple sources for food, stay, and activities</li>
                <li>Estimate budgets without reliable insights</li>
                <li>Create itineraries from scratch</li>
              </ul>
              
              <div className="border-t border-[#00257b]/10 pt-8 mt-8">
                <p className="mb-4">This leads to:</p>
                <ul className="list-disc pl-6 space-y-3 marker:text-[#FF9933]">
                  <li>Time consumption</li>
                  <li>Information overload</li>
                  <li>Poor decision-making</li>
                  <li>Lack of personalization</li>
                </ul>
              </div>

              <div className="bg-[#FF9933]/5 p-8 rounded-[2rem] border border-[#FF9933]/20 mt-8">
                <p className="font-bold text-[#0033A0] mb-6 text-lg">To address this, NOMAD is enhanced into an AI-powered travel companion that:</p>
                <ul className="list-disc pl-6 space-y-3 marker:text-[#FF9933]">
                  <li>Understands user intent through natural input</li>
                  <li>Generates intelligent, day-wise itineraries</li>
                  <li>Suggests nearby places dynamically (food, shopping, attractions)</li>
                  <li>Predicts and analyzes travel expenses</li>
                  <li>Continuously improves based on user behavior</li>
                </ul>
              </div>

              <p className="font-bold text-[#0033A0] mt-8 bg-[#0033A0]/5 p-6 rounded-2xl border border-[#0033A0]/10">
                The system integrates Google AI Studio (Gemini API) to enable real-time, intelligent decision-making while maintaining a familiar and user-friendly interface.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white p-8 lg:p-12 rounded-[2.5rem] border border-[#00257b]/5 shadow-sm">
            <h2 className="text-2xl font-['Noto_Serif'] font-bold text-[#0033A0] mb-8 flex items-center gap-4">
              <span className="w-10 h-10 rounded-full bg-[#FF9933]/10 text-[#FF9933] flex items-center justify-center text-lg font-black">3</span>
              Modules Details and Key Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#00257b]/80">
              {/* Module cards */}
              <div className="bg-[#fdf9f3] p-6 xl:p-8 rounded-[1.5rem] border border-[#00257b]/5 hover:border-[#FF9933]/30 transition-colors">
                <h3 className="font-bold text-[#0033A0] mb-3 flex items-center gap-3"><Icon name="lock" className="text-[#FF9933]" /> Authentication</h3>
                <p className="text-sm leading-relaxed font-medium">Secure login and signup system with persistent session storage to keep you logged in.</p>
              </div>
              <div className="bg-[#fdf9f3] p-6 xl:p-8 rounded-[1.5rem] border border-[#00257b]/5 hover:border-[#FF9933]/30 transition-colors">
                <h3 className="font-bold text-[#0033A0] mb-3 flex items-center gap-3"><Icon name="search" className="text-[#FF9933]" /> NLP Smart Search</h3>
                <p className="text-sm leading-relaxed font-medium">Understands natural queries like "4 days Goa trip" to instantly extract destination and budget.</p>
              </div>
              <div className="bg-[#fdf9f3] p-6 xl:p-8 rounded-[1.5rem] border border-[#00257b]/5 hover:border-[#FF9933]/30 transition-colors">
                <h3 className="font-bold text-[#0033A0] mb-3 flex items-center gap-3"><Icon name="auto_awesome" className="text-[#FF9933]" /> AI Itinerary Engine</h3>
                <p className="text-sm leading-relaxed font-medium">Generates customized, day-by-day travel plans with restaurant ideas and specific activities.</p>
              </div>
              <div className="bg-[#fdf9f3] p-6 xl:p-8 rounded-[1.5rem] border border-[#00257b]/5 hover:border-[#FF9933]/30 transition-colors">
                <h3 className="font-bold text-[#0033A0] mb-3 flex items-center gap-3"><Icon name="event_note" className="text-[#FF9933]" /> Behavioral Planner</h3>
                <p className="text-sm leading-relaxed font-medium">Interactive 17-question form covering deep travel preferences for ultimate personalization.</p>
              </div>
              <div className="bg-[#fdf9f3] p-6 xl:p-8 rounded-[1.5rem] border border-[#00257b]/5 hover:border-[#FF9933]/30 transition-colors">
                <h3 className="font-bold text-[#0033A0] mb-3 flex items-center gap-3"><Icon name="account_balance_wallet" className="text-[#FF9933]" /> Expense Tracker</h3>
                <p className="text-sm leading-relaxed font-medium">Financial module to log everyday expenses, track budgets, and view category breakdowns.</p>
              </div>
              <div className="bg-[#fdf9f3] p-6 xl:p-8 rounded-[1.5rem] border border-[#00257b]/5 hover:border-[#FF9933]/30 transition-colors">
                <h3 className="font-bold text-[#0033A0] mb-3 flex items-center gap-3"><Icon name="explore" className="text-[#FF9933]" /> Experience Explorer</h3>
                <p className="text-sm leading-relaxed font-medium">Curated visual database of 25+ Indian destinations with highlights and budget estimates.</p>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}
