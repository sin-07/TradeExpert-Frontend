'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import ResetPasswordModal from '@/components/ResetPasswordModal';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Failed to send reset code');
        return;
      }

      toast.success(data.message || 'Reset code sent to your email!');
      setShowResetModal(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070b12] text-slate-100 selection:bg-cyan-500 selection:text-black">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-12 flex items-center justify-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="p-8 rounded-3xl bg-[#0b101b] border border-white/10 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto text-cyan-400 shadow-lg">
                <KeyRound className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Forgot Password</h2>
              <p className="text-xs text-slate-400">
                Enter your registered email address to receive a 6-digit password recovery code.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition disabled:opacity-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Sending Code...' : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Reset Code</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-white/10">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />

      <ResetPasswordModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        email={email}
      />
    </div>
  );
}
