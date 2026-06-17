import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export interface AuthUser {
  name: string
  email: string
  photo: string
}

const MOCK_USER: AuthUser = {
  name: 'Alex Reyes',
  email: 'alex.reyes@velocita.ph',
  photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format',
}

interface AuthContextValue {
  user: AuthUser | null
  isLoggedIn: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'velocita-auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as AuthUser) : null
    } catch {
      return null
    }
  })

  function login() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_USER))
    setUser(MOCK_USER)
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
