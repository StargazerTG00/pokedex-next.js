'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

const BASE      = 'https://pokedex-django-backend-production.up.railway.app/api/auth'
const TOKEN_KEY = 'pokedex_access_token'
const USER_KEY  = 'pokedex_username'

type AuthCtx = {
  token:     string | null
  username:  string | null
  hydrated:  boolean          // true once localStorage has been read
  login:     (username: string, password: string) => Promise<void>
  register:  (username: string, email: string, password: string) => Promise<void>
  logout:    () => void
}

const AuthContext = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token,    setToken]    = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  // Rehydrate from localStorage after mount
  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY)
    const u = localStorage.getItem(USER_KEY)
    if (t) setToken(t)
    if (u) setUsername(u)
    setHydrated(true)
  }, [])

  const login = useCallback(async (user: string, password: string) => {
    const res = await fetch(`${BASE}/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, password }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data?.detail ?? 'Invalid credentials')
    }
    const data = await res.json()
    localStorage.setItem(TOKEN_KEY, data.access)
    localStorage.setItem(USER_KEY, user)
    setToken(data.access)
    setUsername(user)
  }, [])

  const register = useCallback(async (user: string, email: string, password: string) => {
    const res = await fetch(`${BASE}/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, email, password }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      const msg = Object.values(data).flat().join(' · ')
      throw new Error(msg || 'Registration failed')
    }
    await login(user, password)
  }, [login])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUsername(null)
  }, [])

  return (
    <AuthContext.Provider value={{ token, username, hydrated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
