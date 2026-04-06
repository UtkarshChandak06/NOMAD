import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import Icon from '../components/Icon'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (signup(name, email, password)) {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-[#fdf9f3] flex items-center justify-center p-6 font-['Plus_Jakarta_Sans']">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 border border-[#00257b]/5 text-center">
        <Link to="/" className="text-3xl font-['Noto_Serif'] font-black text-[#3456c1] tracking-widest uppercase mb-8 inline-block">
          NOMAD
        </Link>
        <h2 className="text-2xl font-bold text-[#00257b] mb-2">Create Account</h2>
        <p className="text-sm text-[#00257b]/60 mb-8">Start your journey today</p>

        {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl flex items-center gap-2">
                <Icon name="error" className="text-sm" filled />
                <span>{error}</span>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#00257b]/50 px-2 mb-2 block">Full Name</label>
            <input
              type="text"
              className="w-full px-6 py-4 bg-[#f8faff] rounded-2xl border-none focus:ring-2 focus:ring-[#FF9933]/50 text-[#00257b] font-medium outline-none"
              placeholder="Utkarsh Chandak"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="text-left">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#00257b]/50 px-2 mb-2 block">Email Address</label>
            <input
              type="email"
              className="w-full px-6 py-4 bg-[#f8faff] rounded-2xl border-none focus:ring-2 focus:ring-[#FF9933]/50 text-[#00257b] font-medium outline-none"
              placeholder="name@destination.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="text-left md:grid md:grid-cols-2 md:gap-4">
             <div className="mb-6 md:mb-0">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#00257b]/50 px-2 mb-2 block">Password</label>
                <input
                    type="password"
                    className="w-full px-6 py-4 bg-[#f8faff] rounded-2xl border-none focus:ring-2 focus:ring-[#FF9933]/50 text-[#00257b] font-medium outline-none"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
             </div>
             <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#00257b]/50 px-2 mb-2 block">Confirm</label>
                <input
                    type="password"
                    className="w-full px-6 py-4 bg-[#f8faff] rounded-2xl border-none focus:ring-2 focus:ring-[#FF9933]/50 text-[#00257b] font-medium outline-none"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
             </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#FF9933] text-white font-black rounded-2xl hover:bg-[#FF9933]/90 transition-all shadow-lg shadow-[#FF9933]/20 flex justify-center items-center gap-3 uppercase tracking-widest text-xs"
          >
            <span>Start Exploring</span>
            <Icon name="arrow_forward" />
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-[#00257b]/5">
            <p className="text-sm text-[#00257b]/50">
                Already have an account?{' '}
                <Link to="/login" className="text-[#3456c1] font-black hover:underline">Sign In</Link>
            </p>
        </div>
      </div>
    </div>
  )
}
