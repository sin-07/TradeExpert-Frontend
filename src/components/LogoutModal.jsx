import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LogoutModal({ isOpen, onClose, onConfirm, isLoggingOut }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with strong blur effect */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-lg z-[9998]"
            onClick={onClose}
            style={{ backdropFilter: 'blur(8px)' }}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden pointer-events-auto ring-1 ring-black/5"
              onClick={(e) => e.stopPropagation()}
            >
              {isLoggingOut ? (
                // Logging Out State
                <div className="p-8 text-center">
                  <div className="mb-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-20 h-20 mx-auto mb-4"
                    >
                      <svg className="w-full h-full text-indigo-600" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </motion.div>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Logging Out...
                  </h3>
                  <p className="text-slate-600">
                    Please wait while we securely log you out
                  </p>
                </div>
              ) : (
                // Confirmation State
                <>
                  {/* Icon */}
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 text-center">
                      Confirm Logout
                    </h3>
                    <p className="text-slate-600 text-center mb-6">
                      Are you sure you want to logout from TradeXpert?
                    </p>

                    {/* Info Box */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div className="text-sm text-amber-800">
                          <p className="font-semibold mb-1">Session Info</p>
                          <p>You'll need to login again to access your account</p>
                        </div>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-200 hover:border-slate-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={onConfirm}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
