import { useAuth } from '../lib/AuthContext'
import Sidebar from '../components/Sidebar'
import Icon from '../components/Icon'
import { useTrips } from '../lib/TripContext'

export default function Profile() {
  const { user, logout } = useAuth()
  const { trips } = useTrips()

  return (
    <div className="bg-[#fdf9f3] min-h-screen flex">
      <Sidebar />
      
      <main className="flex-1 lg:ml-64 p-4 lg:p-12 transition-all">
        <header className="max-w-4xl mx-auto mb-16 pt-10">
            <h1 className="text-6xl font-['Noto_Serif'] font-black text-[#0033A0] tracking-tighter">Your Profile</h1>
            <p className="text-lg text-[#00257b]/40 font-medium mt-2 uppercase tracking-[0.3em] flex items-center gap-2">
                <Icon name="person_outline" className="text-sm" />
                Nomad Explorer since 2026
            </p>
        </header>

        <section className="max-w-4xl mx-auto space-y-12">
            {/* Profile Info Card */}
            <div className="bg-white rounded-[3rem] p-12 border border-[#00257b]/5 shadow-sm flex flex-col md:flex-row gap-12 items-center">
                <div className="relative">
                    <div className="w-40 h-40 rounded-[3rem] bg-[#0033A0] text-white flex items-center justify-center text-6xl font-black shadow-2xl shadow-[#0033A0]/20">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="absolute bottom-2 right-2 w-10 h-10 bg-[#FF9933] rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-lg">
                        <Icon name="edit" className="text-sm" />
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-2">
                    <h2 className="text-4xl font-['Noto_Serif'] font-black text-[#0033A0]">{user?.name || 'Utkarsh Chandak'}</h2>
                    <p className="text-lg text-[#00257b]/60 font-medium">{user?.email || 'utkarsh@nomad.co'}</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
                        <span className="bg-[#0033A0]/5 text-[#0033A0] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-[#0033A0]/10">Pro Explorer</span>
                        <span className="bg-[#FF9933]/10 text-[#FF9933] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-[#FF9933]/20">AI Early Adopter</span>
                    </div>
                </div>
                
                <button 
                  onClick={logout}
                  className="bg-[#d00000]/5 text-[#d00000] px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#d00000] hover:text-white transition-all flex items-center gap-2"
                >
                    <Icon name="logout" className="text-sm" />
                    Sign Out
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="bg-white p-10 rounded-[2.5rem] border border-[#00257b]/5 text-center space-y-2">
                    <p className="text-4xl font-black text-[#0033A0]">{trips.length}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#00257b]/30">Trips Created</p>
                </div>
                <div className="bg-white p-10 rounded-[2.5rem] border border-[#00257b]/5 text-center space-y-2">
                    <p className="text-4xl font-black text-[#0033A0]">12</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#00257b]/30">Destinations Saved</p>
                </div>
                <div className="bg-white p-10 rounded-[2.5rem] border border-[#00257b]/5 text-center space-y-2">
                    <p className="text-4xl font-black text-[#0033A0]">₹0</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#00257b]/30">Total Travel Budget</p>
                </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-[2.5rem] p-12 border border-[#00257b]/5 space-y-8">
                <h3 className="text-2xl font-['Noto_Serif'] font-black text-[#0033A0] flex items-center gap-3">
                    <Icon name="settings_suggest" className="text-[#FF9933]" />
                    Travel Character
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <p className="text-xs font-black uppercase tracking-widest text-[#00257b]/40">Primary Rhythm</p>
                        <div className="flex items-center gap-4 p-4 bg-[#fdf9f3] rounded-2xl border border-[#00257b]/5">
                            <Icon name="slow_motion_video" className="text-[#3456c1]" />
                            <span className="font-bold text-[#0033A0]">Slow & Immersive</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <p className="text-xs font-black uppercase tracking-widest text-[#00257b]/40">Budget Archetype</p>
                        <div className="flex items-center gap-4 p-4 bg-[#fdf9f3] rounded-2xl border border-[#00257b]/5">
                            <Icon name="diamond" className="text-[#3456c1]" />
                            <span className="font-bold text-[#0033A0]">Boutique & Premium</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <footer className="mt-20 py-12 text-center border-t border-[#00257b]/5">
             <p className="text-[#00257b]/10 text-[10px] font-black uppercase tracking-[0.6em]">NOMAD — AI Trip Planner</p>
        </footer>
      </main>
    </div>
  )
}
