import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Icon from '../components/Icon'

const posts = [
  {
    aspect: 'aspect-[4/5]',
    loc: 'Hampi, Karnataka',
    author: 'Aria',
    role: 'Solo Traveler • 2h ago',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0WXOfnYL50oOClzL2ZKbodA9b_TmZIPtJMGCOiGEoKI75jgbQ6yoHFzQB13i-8eNfu-MSNhMCI0-jmbEM0FWb3XTfFW38_uTltnjRzuEgYPvBxCk5z9_N6Gh3GO_fF5skpT4blwf20yOWGgtAxn0G8PEN3hdYSf2m_TY6LoikHVub5Bi2JiP4IyYrapoNoGod6_6K8WigvKhq4xsLt6MKIg9DawPirscNzpKbMh3yZxoVjiCMBHp6NuyrWxcAfcnL8UjaqPA1AQs',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAs6eT8TZZ9Sz7jX5dwcsEcWwvTjnDxSgV-lPdiBM6nDgTdxk7gqP819nMvauFeU4SXiTVAUlCVswQi8ThR0sBpMrx1nkhGtgqtLuPfNQDXaaOddjHt99JjvZ7umoO7j-p4mJUIA-5s5TjsxP9bwPrinkpujHnCXZHcdJXJei-bX5-XahvaEx3q5dl0_kVAgtCVqDKdoTBtVCTsC_1JVV55jDwhsz2z8HI-2_oFHi8dee0UBVp9hkBK01nsczEIowzKOZin1G5dR4c',
    title: 'The silent whispers of the Vijaynagar Empire.',
    excerpt: 'The sun sets differently here. It paints the boulders in a hue of copper that feels almost sacred. Tip: Rent a bicycle early morning to avoid the heat!',
    likes: '1.2k',
    comments: '84',
  },
  {
    aspect: 'aspect-[4/3]',
    loc: 'Mumbai, MH',
    author: 'Rohan V.',
    role: 'Food Explorer • 4h ago',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAffvoL79oCdDHxQaUQfROpMAISpCw19X4o_bknXb5V-wIaOwAlWpzAoqmPaVMJrGZRaLyFwj45T3BvO9o2iSJ3lFHrWAKICkKzCqd0zVwF7nkBbstJGuDGFHGdUj7JVo6mxUu_NfldXcNIh2uFsEtdU_J2um4td9bRpLAMRqutN8-hfYzYN3fYNDfsWedA0WDqfGBrYmzcDO0ktPRp-c6T6tfzE8miCvz5FcRJH7zx3rx4QsWiae6oALYmGP8BvVeiO2ng14MlJqQ',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANCLNYawQt5LoPWkND2plPDwyOzAU_lHw_vbZb3ysNlVn2_Fhd-5eDNCbCMYsM7MokUjGz_n7OcsI82-tcn3hLh69EAJLlnfjA-T90sNZmjulXoMq14giDjDTMq-SQ7SwTVWJV3Jt-brhZ4KZ4FKD_Eiefx1-wByyc2ExupdchDit-kEx2ozQImwqY1hATRVIVvgF62wqXYaACqXuFRdr92SjJOHqyIp5e-BjK4nGZKjlBFeUmBjIGw_3CAcbtE2MaseHsTAaNmLU',
    title: 'Chasing the scent of cardamom and chaos.',
    excerpt: 'Lalbaug Market is sensory overload in the best way possible. Don\'t leave without trying the local Vada Pav from the stall near the east gate.',
    likes: '950',
    comments: '128',
  }
]

export default function Community() {
  return (
    <div className="bg-[#fdf9f3] min-h-screen flex">
      <Sidebar />
      
      <main className="flex-1 lg:ml-64 p-4 lg:p-12 transition-all">
        <header className="max-w-7xl mx-auto mb-16 pt-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-6xl font-['Noto_Serif'] font-black text-[#0033A0] tracking-tighter">India Stories</h1>
                    <p className="text-lg text-[#00257b]/40 font-medium mt-2 uppercase tracking-[0.3em] flex items-center gap-2">
                        <Icon name="groups" className="text-sm" />
                        A Global Collective
                    </p>
                </div>
                <div className="flex bg-white/50 backdrop-blur-md rounded-2xl p-2 border border-[#00257b]/5 shadow-sm">
                    {['Following', 'Global', 'Verified'].map((tab, idx) => (
                        <button key={tab} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${idx === 1 ? 'bg-[#0033A0] text-white' : 'text-[#00257b]/40 hover:text-[#0033A0]'}`}>
                            {tab}
                        </button>
                    ))}
                </div>
            </div>
        </header>

        <section className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Story Feed */}
                <div className="lg:col-span-8 space-y-12">
                    {posts.map((p, idx) => (
                        <article key={idx} className="group bg-white rounded-[3rem] overflow-hidden border border-[#00257b]/5 hover:shadow-2xl transition-all duration-700">
                            <div className={`relative ${p.aspect} overflow-hidden`}>
                                <img src={p.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0033A0]/80 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />
                                <div className="absolute top-8 left-8">
                                    <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#0033A0]">
                                        {p.loc}
                                    </span>
                                </div>
                            </div>
                            <div className="p-12">
                                <div className="flex items-center gap-4 mb-8">
                                    <img src={p.avatar} className="w-12 h-12 rounded-2xl object-cover ring-4 ring-[#FF9933]/10" alt="" />
                                    <div>
                                        <h4 className="font-black text-[#0033A0]">{p.author}</h4>
                                        <p className="text-[10px] font-bold text-[#00257b]/40 uppercase tracking-widest">{p.role}</p>
                                    </div>
                                </div>
                                <h3 className="text-3xl font-['Noto_Serif'] font-black text-[#0033A0] mb-4 group-hover:text-[#FF9933] transition-colors">{p.title}</h3>
                                <p className="text-lg text-[#00257b]/60 leading-relaxed font-medium mb-10">{p.excerpt}</p>
                                
                                <div className="flex items-center justify-between pt-8 border-t border-[#00257b]/5">
                                    <div className="flex gap-8">
                                        <button className="flex items-center gap-2 group/btn">
                                            <Icon name="favorite" className="text-[#d00000]/20 group-hover/btn:text-[#d00000] transition-colors" />
                                            <span className="font-black text-[#00257b] text-sm">{p.likes}</span>
                                        </button>
                                        <button className="flex items-center gap-2 group/btn">
                                            <Icon name="chat_bubble" className="text-[#3456c1]/20 group-hover/btn:text-[#3456c1] transition-colors" />
                                            <span className="font-black text-[#00257b] text-sm">{p.comments}</span>
                                        </button>
                                    </div>
                                    <button className="p-3 bg-[#fdf9f3] rounded-2xl hover:bg-[#FF9933]/10 transition-colors">
                                        <Icon name="share" className="text-[#00257b]/40" />
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Right Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white rounded-[2.5rem] p-10 border border-[#00257b]/5 shadow-sm sticky top-24">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00257b]/30 mb-8 pb-4 border-b border-[#00257b]/5">Top Storytellers</h4>
                        <div className="space-y-6">
                            {[
                                { name: 'Ananya R.', pts: '2.4k pts', icon: 'auto_awesome' },
                                { name: 'Vikram Singh', pts: '2.1k pts', icon: 'stars' },
                                { name: 'Priya Verma', pts: '1.9k pts', icon: 'editor_choice' }
                            ].map((user, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-[#FF9933]/10 rounded-xl flex items-center justify-center text-[#FF9933] font-black text-xs">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#0033A0]">{user.name}</p>
                                            <p className="text-[9px] font-black text-[#00257b]/30 uppercase tracking-widest">{user.pts}</p>
                                        </div>
                                    </div>
                                    <Icon name={user.icon} className="text-[#FF9933]/20" />
                                </div>
                            ))}
                        </div>
                        <button className="w-full bg-[#0033A0] text-white mt-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:scale-105 active:scale-95 transition-all">
                            Engage Now
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <footer className="mt-32 py-12 text-center border-t border-[#00257b]/5">
             <p className="text-[#00257b]/10 text-[10px] font-black uppercase tracking-[0.6em]">Collective Consciousness • Nomad</p>
        </footer>
      </main>
    </div>
  )
}
