'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, ShieldAlert } from 'lucide-react';
import useScrollLock from '@/hooks/useScrollLock';

export default function LogoutModal({ isOpen, onClose, onConfirm, isLoggingOut }) {
  const [mounted, setMounted] = useState(false);

  // Freeze background scrolling when modal is open
  useScrollLock(isOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9998] touch-none overscroll-contain select-none"
            onClick={isLoggingOut ? undefined : onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative pointer-events-auto w-full max-w-md overflow-hidden rounded-3xl bg-[#0b101b] border border-white/10 shadow-2xl"
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-lg flex-shrink-0">
                    <LogOut className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">Exit Terminal Session?</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Your open positions and pending orders will remain active on the server.
                    </p>
                  </div>
                </div>

                {/* Info box */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-amber-300 mb-0.5">Session Security</p>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        To access live executions and your virtual portfolio again, you can sign in anytime with your credentials.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={onClose}
                    disabled={isLoggingOut}
                    className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-semibold text-slate-300 hover:bg-white/[0.08] hover:text-white transition disabled:opacity-50"
                  >
                    Stay Logged In
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={isLoggingOut}
                    className="flex-1 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-rose-600/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoggingOut ? (
                      <>
                        <div className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        <span>Exiting...</span>
                      </>
                    ) : (
                      <span>Confirm Logout</span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
