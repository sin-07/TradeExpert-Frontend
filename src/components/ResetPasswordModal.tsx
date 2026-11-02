'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, KeyRound, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useScrollLock from '@/hooks/useScrollLock';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export default function ResetPasswordModal({ isOpen, onClose, email }) {
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Freeze background scrolling when modal is open
  useScrollLock(isOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!resetToken || resetToken.length !== 6) {
      toast.error('Please enter the 6-digit reset code');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          resetToken,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Failed to reset password');
        return;
      }

      toast.success('Password reset successfully! Please sign in.');
      onClose();
      router.push('/login');
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9998] touch-none overscroll-contain select-none"
            onClick={loading ? undefined : onClose}
          />

          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative pointer-events-auto w-full max-w-md overflow-hidden rounded-3xl bg-[#0b101b] border border-white/10 shadow-2xl"
            >
              <button
                onClick={onClose}
                disabled={loading}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <KeyRound className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">Set New Password</h3>
                    <p className="text-xs text-slate-400">
                      Enter the 6-digit code sent to <span className="text-cyan-400">{email}</span>
                    </p>
                  </div>
                </div>

                <form onSubmit={handleReset} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      6-Digit Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value.trim())}
                      placeholder="123456"
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-cyan-300 font-mono tracking-widest text-center text-lg focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={loading}
                      className="flex-1 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-xs font-semibold text-slate-300 hover:bg-white/[0.08] transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 text-xs font-bold transition shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
