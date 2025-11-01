import React from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, ShieldAlert } from 'lucide-react'

export default function LogoutModal({ isOpen, onClose, onConfirm, isLoggingOut }) {
  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[9998]"
            onClick={isLoggingOut ? undefined : onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative pointer-events-auto w-full max-w-md overflow-hidden rounded-3xl shadow-[0_25px_80px_rgba(15,23,42,0.4)] bg-white border border-slate-100"
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="relative">
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 shadow-lg">
                      <LogOut className="h-8 w-8 text-slate-700" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">Logout Confirmation</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      End your trading session securely
                    </p>
                  </div>
                </div>

                {/* Info box */}
                <div className="relative overflow-hidden rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-4 mb-8 shadow-sm">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full blur-2xl -mr-16 -mt-16"></div>
                  <div className="relative flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <ShieldAlert className="h-5 w-5 text-indigo-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-indigo-900 mb-1">Security Notice</p>
                      <p className="text-sm text-indigo-700 leading-relaxed">
                        Your portfolio and trading data will remain secure. You'll need to login again to continue trading.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    disabled={isLoggingOut}
                    className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition-all hover:border-indigo-200 hover:bg-gradient-to-r hover:from-slate-50 hover:to-indigo-50 hover:shadow-md disabled:pointer-events-none disabled:opacity-60"
                  >
                    Stay Logged In
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onConfirm}
                    disabled={isLoggingOut}
                    className="relative flex-1 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/60 disabled:opacity-60 overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative flex items-center justify-center gap-2">
                      {isLoggingOut ? (
                        <>
                          <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          Logging Out...
                        </>
                      ) : (
                        <>
                          <LogOut className="h-4 w-4" />
                          Confirm Logout
                        </>
                      )}
                    </span>
                  </motion.button>
                </div>
              </div>

              {/* Loading overlay */}
              {isLoggingOut && (
                <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-white/80 backdrop-blur-md">
                  <motion.div
                    className="h-16 w-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 shadow-lg"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                  />
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
