import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, LogOut, LayoutDashboard, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import LogoutModal from './LogoutModal'

export default function Navbar({ logged, setLogged }){
  const navigate = useNavigate()
  const location = useLocation()
  const { logout: authLogout, isAuthenticated, user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  
  const handleLogoutClick = () => {
    setShowLogoutModal(true)
    setMobileMenuOpen(false)
  }

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true)
    
    // Simulate logout process with a delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    authLogout()
    setLogged(false)
    setIsLoggingOut(false)
    setShowLogoutModal(false)
    navigate('/login')
  }

  const handleLogoutCancel = () => {
    setShowLogoutModal(false)
  }
  
  const isLogged = logged !== undefined ? logged : isAuthenticated
  
  const isActive = (path) => location.pathname === path

  const closeMobileMenu = () => setMobileMenuOpen(false)
  
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to='/' onClick={closeMobileMenu} className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg"
            >
              <TrendingUp className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              TradeXpert
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <Link 
              to='/' 
              className={`relative px-4 py-2 text-sm font-medium transition-all rounded-lg ${
                isActive('/') 
                  ? 'text-indigo-600 bg-indigo-50' 
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              Home
              {isActive('/') && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
            
            {isLogged && (
              <Link 
                to='/dashboard' 
                className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all rounded-lg ${
                  isActive('/dashboard') 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
                {isActive('/dashboard') && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )}
            
            {/* Auth Buttons */}
            {!isLogged ? (
              <div className="flex items-center gap-3">
                <Link 
                  to='/login' 
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  to='/signup' 
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium shadow-md hover:shadow-lg transition-all hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {user && (
                  <div className="text-sm hidden xl:block">
                    <span className="text-slate-500">Welcome, </span>
                    <span className="font-semibold text-slate-900">{user.name}</span>
                  </div>
                )}
                <button 
                  onClick={handleLogoutClick} 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500 text-white text-sm font-medium shadow-md hover:shadow-lg hover:bg-rose-600 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-indigo-600 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-3 border-t border-slate-200">
                {user && isLogged && (
                  <div className="px-4 py-2 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500">Logged in as</p>
                    <p className="font-semibold text-slate-900">{user.name}</p>
                    <p className="text-sm text-slate-600">{user.email}</p>
                  </div>
                )}
                
                <Link 
                  to='/' 
                  onClick={closeMobileMenu}
                  className={`relative block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/') 
                      ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Home
                </Link>
                
                {isLogged && (
                  <Link 
                    to='/dashboard' 
                    onClick={closeMobileMenu}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/dashboard') 
                        ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                )}
                
                {!isLogged ? (
                  <>
                    <Link 
                      to='/login' 
                      onClick={closeMobileMenu}
                      className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link 
                      to='/signup' 
                      onClick={closeMobileMenu}
                      className="block px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium text-center shadow-md"
                    >
                      Get Started
                    </Link>
                  </>
                ) : (
                  <button 
                    onClick={handleLogoutClick} 
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-rose-500 text-white text-sm font-medium shadow-md"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        isLoggingOut={isLoggingOut}
      />
    </motion.nav>
  )
}
