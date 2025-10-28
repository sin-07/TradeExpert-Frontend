import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
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
  const logoutTimerRef = useRef(null)

  // Auto logout after 1 hour
  const startLogoutTimer = () => {
    // Clear any existing timer
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current)
    }

    // Set timer for 1 hour (3600000 ms)
    logoutTimerRef.current = setTimeout(() => {
      handleAutoLogout()
    }, 3600000) // 1 hour

    // Store login time
    localStorage.setItem('tradexpert_login_time', Date.now().toString())
  }

  const handleAutoLogout = () => {
    api.logout()
    setUser(null)
    localStorage.removeItem('tradexpert_login_time')
    toast.error('Session expired. Please login again.', {
      duration: 4000,
      icon: '⏰'
    })
    // Redirect to login page
    window.location.href = '/login'
  }

  useEffect(() => {
    // Check if user is logged in on mount
    const token = api.getToken()
    const loginTime = localStorage.getItem('tradexpert_login_time')

    if (token) {
      // Check if session is still valid (less than 1 hour)
      if (loginTime) {
        const elapsed = Date.now() - parseInt(loginTime)
        const oneHour = 3600000

        if (elapsed >= oneHour) {
          // Session expired
          handleAutoLogout()
          setLoading(false)
          return
        } else {
          // Start timer for remaining time
          const remainingTime = oneHour - elapsed
          logoutTimerRef.current = setTimeout(() => {
            handleAutoLogout()
          }, remainingTime)
        }
      }

      api.getMe()
        .then(userData => {
          setUser(userData)
          if (!loginTime) {
            startLogoutTimer()
          }
        })
        .catch(err => {
          console.error('Failed to fetch user:', err)
          api.removeToken()
          localStorage.removeItem('tradexpert_login_time')
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }

    // Cleanup timer on unmount
    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current)
      }
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
    startLogoutTimer()
    return data
  }

  const logout = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current)
    }
    api.logout()
    setUser(null)
    localStorage.removeItem('tradexpert_login_time')
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
