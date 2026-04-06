import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import Icon from '../components/Icon'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (login(email, password)) {
      navigate('/')
    } else {
      setError('Invalid credentials or user not found. Please sign up first.')
    }
  }

  return (
    <div className="min-h-screen bg-[#fdf9f3] flex items-center justify-center p-6 font-['Plus_Jakarta_Sans']">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 border border-[#00257b]/5 text-center">
        <Link to="/" className="text-3xl font-['Noto_Serif'] font-black text-[#3456c1] tracking-widest uppercase mb-8 inline-block">
          NOMAD
        </Link>
        <h2 className="text-2xl font-bold text-[#00257b] mb-2">Welcome Back</h2>
        <p className="text-sm text-[#00257b]/60 mb-8">Sign in to continue your journey</p>

        {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl flex items-center gap-2">
                <Icon name="error" className="text-sm" filled />
                <span>{error}</span>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
          <div className="text-left">
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
          <button
            type="submit"
            className="w-full py-4 bg-[#0033A0] text-white font-black rounded-2xl hover:bg-[#0033A0]/90 transition-all shadow-lg shadow-[#0033A0]/20 flex justify-center items-center gap-3 uppercase tracking-widest text-xs"
          >
            <span>Sign In</span>
            <Icon name="arrow_forward" />
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-[#00257b]/5">
            <p className="text-sm text-[#00257b]/50">
                Don&apos;t have an account?{' '}
                <Link to="/signup" className="text-[#FF9933] font-black hover:underline">Create Account</Link>
            </p>
        </div>
      </div>
    </div>
  )
}
