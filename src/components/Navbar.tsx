'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PlusCircle, 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard,
  ShieldCheck,
  Activity
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import LogoutModal from '@/components/LogoutModal';
import api from '@/lib/api';

// Live Ticker Tape Data
const TICKER_ITEMS = [
  { s: 'NIFTY 50', p: '24,850.40', c: '+0.65%', up: true },
  { s: 'SENSEX', p: '81,520.15', c: '+0.58%', up: true },
  { s: 'BTC/USDT', p: '$68,420.00', c: '+2.14%', up: true },
  { s: 'ETH/USDT', p: '$2,640.80', c: '-0.42%', up: false },
  { s: 'AAPL', p: '$232.10', c: '+1.12%', up: true },
  { s: 'NVDA', p: '$141.50', c: '+3.45%', up: true },
  { s: 'TSLA', p: '$218.40', c: '-1.25%', up: false },
  { s: 'RELIANCE', p: '₹2,950.00', c: '+1.05%', up: true },
  { s: 'TCS', p: '₹4,120.30', c: '+0.32%', up: true },
  { s: 'HDFCBANK', p: '₹1,680.50', c: '-0.20%', up: false },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout: authLogout, isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [virtualBalance, setVirtualBalance] = useState(null);

  // Fetch quick balance for navbar
  useEffect(() => {
    if (isAuthenticated) {
      api.getPortfolio()
        .then((data) => setVirtualBalance(data.balance ?? 50000))
        .catch(() => setVirtualBalance(50000));
    }
  }, [isAuthenticated, pathname]);

  const handleDepositQuick = async () => {
    try {
      const res = await api.depositFunds(50000);
      setVirtualBalance(res.balance);
      toast.success('+₹50,000 Virtual Funds Added!', { icon: '💰' });
      if (pathname === '/dashboard') {
        window.location.reload();
      }
    } catch (err) {
      toast.error('Failed to add virtual funds');
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setMobileMenuOpen(false);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    await new Promise((r) => setTimeout(r, 600));
    authLogout();
    setIsLoggingOut(false);
    setShowLogoutModal(false);
    router.push('/login');
  };

  const isActive = (path) => pathname === path;
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      {/* 1. Live Financial Marquee Ticker Tape */}
      <div className="w-full bg-[#05080f] border-b border-white/5 py-1.5 overflow-hidden select-none">
        <div className="animate-ticker flex items-center whitespace-nowrap gap-8">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
            <div key={idx} className="inline-flex items-center gap-2 text-xs font-mono">
              <span className="font-bold text-slate-300 tracking-wider">{item.s}</span>
              <span className="text-white font-medium">{item.p}</span>
              <span
                className={`inline-flex items-center text-[11px] font-semibold ${
                  item.up ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {item.up ? '+' : ''}{item.c}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Main Navigation Header */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-50 bg-[#090d16]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Live Badge (Crisp rectangular fintech style) */}
            <div className="flex items-center gap-6">
              <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
                  <div className="w-full h-full bg-[#0b101b] rounded-[10px] flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                    Trade<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-300">Xpert</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase -mt-1">
                    Terminal v2.0
                  </span>
                </div>
              </Link>

              <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Paper Trading
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              <Link
                href="/"
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                  isActive('/')
                    ? 'text-white bg-white/10 shadow-inner'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Market Overview
              </Link>
              <Link
                href="/dashboard"
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all flex items-center gap-2 ${
                  isActive('/dashboard')
                    ? 'text-white bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border border-indigo-500/30 shadow-inner'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <LayoutDashboard size={16} className="text-cyan-400" />
                Trading Terminal
              </Link>
            </div>

            {/* Right Side: Virtual Balance & User Controls */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {/* Real-time Virtual Balance Widget */}
                  <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#0b101b] border border-white/10 rounded-xl shadow-inner">
                    <Wallet className="w-4 h-4 text-emerald-400" />
                    <div className="flex flex-col text-right">
                      <span className="text-[9px] font-mono uppercase text-slate-400 tracking-wider leading-none">
                        Virtual Balance
                      </span>
                      <span className="text-xs font-mono font-bold text-white leading-tight">
                        ₹{(virtualBalance ?? 50000).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <button
                      onClick={handleDepositQuick}
                      title="Add ₹50,000 Virtual Funds"
                      className="ml-1 p-1 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors"
                    >
                      <PlusCircle size={16} />
                    </button>
                  </div>

                  {/* User Profile & Logout */}
                  <div className="flex items-center gap-3 pl-2 border-l border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <button
                      onClick={handleLogoutClick}
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/signup"
                    className="relative group overflow-hidden px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-lg shadow-indigo-600/30"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 transition-all group-hover:scale-105" />
                    <span className="relative flex items-center gap-1.5">
                      <ShieldCheck size={15} />
                      Start Trading
                    </span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Mobile Drawer */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden py-4 border-t border-white/10 space-y-3"
              >
                {isAuthenticated && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-semibold">{user?.name || 'Trader'}</p>
                      <p className="font-mono text-base font-bold text-emerald-400">
                        ₹{(virtualBalance ?? 50000).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={handleDepositQuick}
                      className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-lg"
                    >
                      + Topup
                    </button>
                  </div>
                )}

                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/5 rounded-lg"
                >
                  Market Overview
                </Link>
                <Link
                  href="/dashboard"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-cyan-400 hover:bg-white/5 rounded-lg"
                >
                  <LayoutDashboard size={16} />
                  Trading Terminal
                </Link>

                {!isAuthenticated ? (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Link
                      href="/login"
                      onClick={closeMobileMenu}
                      className="py-2.5 text-center text-sm font-semibold text-slate-200 bg-white/5 rounded-xl border border-white/10"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={closeMobileMenu}
                      className="py-2.5 text-center text-sm font-semibold text-white bg-indigo-600 rounded-xl"
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleLogoutClick}
                    className="w-full py-2.5 text-center text-sm font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl"
                  >
                    Logout
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <LogoutModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogoutConfirm}
          isLoggingOut={isLoggingOut}
        />
      </motion.nav>
    </>
  );
}
