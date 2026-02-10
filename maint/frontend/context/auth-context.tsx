'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, AuthResponse } from '@/lib/types'
import { API_URL, apiFetch } from '@/lib/api'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (full_name: string, email: string, phone: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in by fetching /auth/users/me
    const initAuth = async () => {
      try {
        const userData = await apiFetch<User>('/auth/users/me')
        setUser(userData)
      } catch (error) {
        console.log('No active session found')
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    // OpenAI/FastAPI OAuth2 expects form-data for /auth/token by default
    const formData = new FormData()
    formData.append('username', email) // Using email as username in this system
    formData.append('password', password)

    const response = await fetch(`${API_URL}/auth/token`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Invalid credentials')
    }

    const data: AuthResponse = await response.json()
    setUser(data.user)
  }

  const register = async (full_name: string, email: string, phone: string, password: string) => {
    // Generate username from email (standard practice if no username field)
    const username = email

    await apiFetch<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, full_name, email, phone, password }),
    })

    // After registration, log them in
    await login(email, password)
  }

  const logout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

