'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ForgotPasswordModal from '@/components/ForgotPasswordModal';
import ResetPasswordModal from '@/components/ResetPasswordModal';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const loadingToast = toast.loading('Authenticating...');

    try {
      const response = await login(email, password);

      if (response?.requiresVerification) {
        toast.error('Please verify your email OTP first', { id: loadingToast });
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
        return;
      }

      toast.success('Welcome back to TradeXpert!', { id: loadingToast });
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Invalid email or password', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070b12] text-slate-100 selection:bg-cyan-500 selection:text-black">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-12 flex items-center justify-center relative">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-3xl bg-[#0b101b] border border-white/10 shadow-2xl space-y-6"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Sign In to Terminal
              </h2>
              <p className="text-xs text-slate-400">
                Access your real-time simulated portfolio &amp; order book
              </p>
            </div>

            {/* Standard Login Form */}
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(true)}
                    className="text-[11px] font-semibold text-cyan-400 hover:underline"
                  >
                    Forgot code?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Authenticating...' : 'Sign In To Terminal'}
              </button>
            </form>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-400">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-cyan-400 font-bold hover:underline">
                  Sign up free
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />

      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        onSuccess={(em) => {
          setResetEmail(em);
          setShowResetPasswordModal(true);
        }}
      />

      <ResetPasswordModal
        isOpen={showResetPasswordModal}
        onClose={() => setShowResetPasswordModal(false)}
        email={resetEmail}
      />
    </div>
  );
}
