'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const submit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Creating your account...');

    try {
      await api.signup(name, email, password);
      toast.success('Account created! Please check your email for the verification code.', { id: loadingToast });
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      toast.error(err.message || 'Signup failed', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070b12] text-slate-100 selection:bg-cyan-500 selection:text-black">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-12 flex items-center justify-center relative">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-cyan-600/10 rounded-full blur-[110px] pointer-events-none" />

        <div className="w-full max-w-lg relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-3xl bg-[#0b101b] border border-white/10 shadow-2xl space-y-6"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Institutional Paper Trading
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Create Free Account
              </h2>
              <p className="text-xs text-slate-400">
                Start with ₹10,00,000 virtual balance &amp; institutional order routing
              </p>
            </div>

            {/* Standard Signup Form */}
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Trader Name"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                  />
                </div>
              </div>

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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
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
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                <span>Instant paper trading credit: ₹10,00,000 + 0 brokerage</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-sm tracking-wide transition shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Creating Account...' : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-white/10">
              <p className="text-xs text-slate-400">
                Already have an account?{' '}
                <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4">
                  Sign In
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
