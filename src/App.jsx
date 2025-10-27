import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import VerifyOTP from './pages/VerifyOTP'
import Dashboard from './pages/Dashboard'

export default function App(){
  const { isAuthenticated, loading } = useAuth()

  const PrivateRoute = ({ children }) => {
    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    return isAuthenticated ? children : <Navigate to="/login" replace />
  }

  return (
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/signup' element={<Signup/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/verify-otp' element={<VerifyOTP/>} />
      <Route path='/dashboard' element={
        <PrivateRoute><Dashboard/></PrivateRoute>
      } />
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  )
}
