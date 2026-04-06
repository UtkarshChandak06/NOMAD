import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('nomad_user')
    const isLoggedIn = localStorage.getItem('nomad_isLoggedIn')
    
    if (isLoggedIn === 'true' && savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const signup = (name, email, password) => {
    const newUser = { name, email, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcS9LsOuGPM36q71drKVYRgeb4ufUob6niYoJMbdzNBTkeCzoqkF4tfdP79dBaZWA987M2HEkrwew_FaxNl2SdSpi5eYtyI7-HbX2pP1JBpAlSYRZJ0gbO6TwIpu7tWGZDlZrLL5oYFdBvLcxb5hWE10DIlrXwXpAvZURFYtlelGuXvl9_DXkhvsBfhXsQCtc5w_eXXsQJM1UFU92w3Bt6d8YJ_uatETVD-gFZ8uElJKEZhMgzZUojy-FYJyz3xOgw2DvoBbsbAFA' }
    localStorage.setItem('nomad_user', JSON.stringify(newUser))
    localStorage.setItem('nomad_isLoggedIn', 'true')
    setUser(newUser)
    return true
  }

  const login = (email, password) => {
    // Basic simulation: any email/password works if a user is "registered"
    const savedUser = localStorage.getItem('nomad_user')
    if (savedUser) {
      localStorage.setItem('nomad_isLoggedIn', 'true')
      setUser(JSON.parse(savedUser))
      return true
    }
    return false
  }

  const skipLogin = () => {
    const guestUser = { name: 'Guest Explorer', email: 'guest@nomad.app', avatar: '' }
    localStorage.setItem('nomad_user', JSON.stringify(guestUser))
    localStorage.setItem('nomad_isLoggedIn', 'true')
    setUser(guestUser)
    return true
  }

  const logout = () => {
    localStorage.removeItem('nomad_isLoggedIn')
    localStorage.removeItem('nomad_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, signup, skipLogin, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
