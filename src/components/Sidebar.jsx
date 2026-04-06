import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Icon from './Icon'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const links = [
    { to: '/', label: 'Home', icon: 'home' },
    { to: '/explore', label: 'Explore', icon: 'explore' },
    { to: '/planner', label: 'Plan a Trip', icon: 'event_note' },
    { to: '/saved-trips', label: 'Saved Trips', icon: 'bookmark' },
    { to: '/expenses', label: 'Expenses', icon: 'account_balance_wallet' },
    { to: '/about', label: 'About Project', icon: 'info' },
    { to: '/profile', label: 'Profile', icon: 'account_circle' },
  ]

  const handleLogout = () => {
    // Basic simulation for now
    localStorage.removeItem('nomad_isLoggedIn')
    navigate('/login')
  }

  return (
    <>
      {/* Mobile Header/Hamburger */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-[#fdf9f3]/90 backdrop-blur-md border-b border-[#00257b]/10 p-4 z-50 flex justify-between items-center">
        <Link to="/" className="text-xl font-['Noto_Serif'] font-black text-[#3456c1] tracking-widest">
          NOMAD
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-[#00257b]"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          <Icon name={isOpen ? 'close' : 'menu'} />
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside className={`
        fixed font-['Plus_Jakarta_Sans'] font-semibold text-sm
        top-0 left-0 h-screen w-64 bg-[#fdf9f3] border-r border-[#00257b]/10 
        transition-transform duration-300 z-50
        flex flex-col py-8
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="px-8 mb-12 hidden lg:block">
          <Link to="/" className="text-2xl font-['Noto_Serif'] font-black text-[#3456c1] tracking-widest uppercase">
            NOMAD
          </Link>
          <p className="text-[9px] uppercase tracking-widest text-[#00257b]/50 mt-1 leading-relaxed">AI Trip Planner &<br />Travel Assistant</p>
          <p className="text-[8px] uppercase tracking-widest text-[#FF9933]/60 mt-1 font-bold">24BCI0156</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300
                ${pathname === link.to 
                  ? 'bg-[#FF9933] text-white shadow-lg shadow-[#FF9933]/30' 
                  : 'text-[#00257b]/70 hover:bg-[#FF9933]/10 hover:text-[#00257b]'
                }
              `}
            >
              <Icon name={link.icon} filled={pathname === link.to} />
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="px-4 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl text-[#d00000]/70 hover:bg-[#d00000]/5 transition-all font-semibold"
          >
            <Icon name="logout" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
