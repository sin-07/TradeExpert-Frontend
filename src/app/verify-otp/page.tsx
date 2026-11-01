'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function VerifyOTPContent() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  useEffect(() => {
    if (!email) {
      toast.error('No email provided');
      router.push('/signup');
      return;
    }
  }, [email, router]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('');
    while (newOtp.length < 6) newOtp.push('');
    setOtp(newOtp);

    if (pastedData.length === 6) {
      document.getElementById('otp-5')?.focus();
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      toast.error('Please enter the full 6-digit OTP code');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Verifying code & initializing portfolio...');

    try {
      await api.verifyOTP(email, otpString);
      toast.success('Account verified! Welcome to TradeXpert.', { id: loadingToast, icon: '🎉' });
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Invalid or expired OTP', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    const loadingToast = toast.loading('Sending verification code to your email...');

    try {
      await api.resendOTP(email);
      toast.success('Verification code sent to your email!', { id: loadingToast });
      setOtp(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend code', { id: loadingToast });
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="flex-1 container mx-auto px-4 sm:px-6 py-12 flex items-center justify-center relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="p-8 rounded-3xl bg-[#0b101b] border border-white/10 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto text-cyan-400 shadow-lg">
              <KeyRound className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Verify Your Account
            </h2>
            <p className="text-xs text-slate-400">
              We sent a 6-digit confirmation code to<br />
              <span className="font-semibold text-cyan-400">{email}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-3 text-center uppercase tracking-wider">
                Enter 6-Digit Code
              </label>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-11 h-14 text-center text-2xl font-mono font-black rounded-xl bg-white/[0.04] border border-white/10 text-cyan-300 focus:border-cyan-400 focus:bg-cyan-500/[0.05] focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                  />
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-3 text-center">
                Code valid for 10 minutes
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 transition disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Launch Terminal'}
            </button>
          </form>

          {/* Actions */}
          <div className="pt-2 border-t border-white/10 text-center space-y-3">
            <button
              onClick={handleResendOTP}
              disabled={resending}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold disabled:opacity-50"
            >
              {resending ? 'Sending...' : "Didn't receive code? Resend OTP"}
            </button>

            <div>
              <button
                onClick={() => router.push('/signup')}
                className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Signup</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}

export default function VerifyOTPPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#070b12] text-slate-100 selection:bg-cyan-500 selection:text-black">
      <Navbar />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-slate-400">Loading verification...</div>}>
        <VerifyOTPContent />
      </Suspense>
      <Footer />
    </div>
  );
}
