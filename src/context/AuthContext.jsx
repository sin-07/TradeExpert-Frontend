import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const token = api.getToken()
    if (token) {
      api.getMe()
        .then(userData => {
          setUser(userData)
        })
        .catch(err => {
          console.error('Failed to fetch user:', err)
          api.removeToken()
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const signup = async (name, email, password) => {
    const data = await api.signup(name, email, password)
    setUser(data.user)
    return data
  }

  const login = async (email, password) => {
    const data = await api.login(email, password)
    setUser(data.user)
    return data
  }

  const logout = () => {
    api.logout()
    setUser(null)
  }

  const isAuthenticated = !!user

  const value = {
    user,
    loading,
    isAuthenticated,
    signup,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
