'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PlusCircle, 
  LogOut, 
  X, 
  LayoutDashboard,
  ShieldCheck,
  Activity,
  ArrowRight,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import LogoutModal from '@/components/LogoutModal';
import useScrollLock from '@/hooks/useScrollLock';
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
  const [mounted, setMounted] = useState(false);

  // Freeze background scrolling when sidebar is open
  useScrollLock(mobileMenuOpen);

  // GSAP Animation Refs
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const line3Ref = useRef(null);
  const backdropRef = useRef(null);
  const sidebarRef = useRef(null);
  const menuListRef = useRef(null);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    closeMobileMenu();
    setShowLogoutModal(true);
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

  // GSAP Smooth Hamburger Morph & Sidebar Slide Animation
  const openSidebar = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setMobileMenuOpen(true);

    // Morph hamburger icon to X
    if (line1Ref.current && line2Ref.current && line3Ref.current) {
      gsap.to(line1Ref.current, {
        y: 7,
        rotation: 45,
        backgroundColor: '#22d3ee',
        duration: 0.3,
        ease: 'power2.inOut',
      });
      gsap.to(line2Ref.current, {
        opacity: 0,
        scaleX: 0,
        duration: 0.2,
        ease: 'power2.inOut',
      });
      gsap.to(line3Ref.current, {
        y: -7,
        rotation: -45,
        backgroundColor: '#22d3ee',
        duration: 0.3,
        ease: 'power2.inOut',
      });
    }

    // Animate Backdrop & Sidebar Drawer
    if (backdropRef.current && sidebarRef.current) {
      gsap.killTweensOf([backdropRef.current, sidebarRef.current]);

      gsap.fromTo(
        backdropRef.current,
        { opacity: 0, display: 'none' },
        {
          opacity: 1,
          display: 'block',
          duration: 0.35,
          ease: 'power2.out',
        }
      );

      gsap.fromTo(
        sidebarRef.current,
        { x: '100%', display: 'none' },
        {
          x: '0%',
          display: 'flex',
          duration: 0.45,
          ease: 'power4.out',
          onComplete: () => {
            isAnimatingRef.current = false;
          },
        }
      );

      // Stagger items inside drawer
      if (menuListRef.current) {
        const items = menuListRef.current.querySelectorAll('.gsap-menu-item');
        if (items.length > 0) {
          gsap.fromTo(
            items,
            { opacity: 0, x: 25 },
            {
              opacity: 1,
              x: 0,
              stagger: 0.04,
              duration: 0.35,
              ease: 'power3.out',
              delay: 0.1,
            }
          );
        }
      }
    } else {
      isAnimatingRef.current = false;
    }
  }, []);

  const closeMobileMenu = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    // Morph hamburger icon back
    if (line1Ref.current && line2Ref.current && line3Ref.current) {
      gsap.to(line1Ref.current, {
        y: 0,
        rotation: 0,
        backgroundColor: '#22d3ee',
        duration: 0.3,
        ease: 'power2.inOut',
      });
      gsap.to(line2Ref.current, {
        opacity: 1,
        scaleX: 1,
        duration: 0.25,
        ease: 'power2.inOut',
      });
      gsap.to(line3Ref.current, {
        y: 0,
        rotation: 0,
        backgroundColor: '#22d3ee',
        duration: 0.3,
        ease: 'power2.inOut',
      });
    }

    // Animate Backdrop & Sidebar Out
    if (backdropRef.current && sidebarRef.current) {
      gsap.killTweensOf([backdropRef.current, sidebarRef.current]);

      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          if (backdropRef.current) backdropRef.current.style.display = 'none';
        },
      });

      gsap.to(sidebarRef.current, {
        x: '100%',
        duration: 0.35,
        ease: 'power3.in',
        onComplete: () => {
          if (sidebarRef.current) sidebarRef.current.style.display = 'none';
          setMobileMenuOpen(false);
          isAnimatingRef.current = false;
        },
      });
    } else {
      setMobileMenuOpen(false);
      isAnimatingRef.current = false;
    }
  }, []);

  const toggleMobileMenu = () => {
    if (mobileMenuOpen) {
      closeMobileMenu();
    } else {
      openSidebar();
    }
  };

  // Close on route change
  useEffect(() => {
    if (mobileMenuOpen) {
      closeMobileMenu();
    }
  }, [pathname]);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        closeMobileMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen, closeMobileMenu]);

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

            {/* GSAP Morphing Hamburger Button */}
            <button
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
              className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-200 transition-all focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            >
              <span
                ref={line1Ref}
                className="w-5 h-0.5 bg-cyan-400 rounded-full block origin-center"
              />
              <span
                ref={line2Ref}
                className="w-5 h-0.5 bg-slate-300 rounded-full block origin-center"
              />
              <span
                ref={line3Ref}
                className="w-5 h-0.5 bg-cyan-400 rounded-full block origin-center"
              />
            </button>
          </div>
        </div>

        {/* 3. High-Performance GSAP Hardware-Accelerated Side Sidebar Drawer */}
        {mounted && typeof document !== 'undefined' && createPortal(
          <>
            {/* Backdrop Blur Overlay */}
            <div
              ref={backdropRef}
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-black/75 backdrop-blur-md z-[9998] hidden touch-none overscroll-contain select-none"
              style={{ opacity: 0 }}
            />

            {/* Sliding Side Drawer */}
            <aside
              ref={sidebarRef}
              aria-label="Mobile Navigation Sidebar"
              className="fixed top-0 right-0 bottom-0 w-[320px] max-w-[85vw] bg-[#070b14] border-l border-white/10 z-[9999] shadow-2xl flex flex-col justify-between hidden overflow-hidden"
              style={{ transform: 'translateX(100%)' }}
            >
              {/* Drawer Ambient Glow */}
              <div className="absolute -top-24 -right-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

              {/* Top Section */}
              <div className="p-6 overflow-y-auto flex-1 relative z-10" ref={menuListRef}>
                {/* Header inside Drawer */}
                <div className="gsap-menu-item flex items-center justify-between pb-5 border-b border-white/10 mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 p-[1px] shadow-md shadow-indigo-500/20">
                      <div className="w-full h-full bg-[#0b101b] rounded-[7px] flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-cyan-400" />
                      </div>
                    </div>
                    <span className="text-base font-bold text-white tracking-tight">
                      Trade<span className="text-cyan-400">Xpert</span>
                    </span>
                  </div>

                  <button
                    onClick={closeMobileMenu}
                    aria-label="Close Sidebar"
                    className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Authenticated User Status & Quick Topup Card */}
                {isAuthenticated && (
                  <div className="gsap-menu-item p-4 rounded-2xl bg-[#0b101b] border border-cyan-500/20 mb-5 shadow-lg relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                          {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white leading-tight">{user?.name || 'Trader'}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{user?.email || 'Active Account'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-mono">
                          Paper Balance
                        </span>
                        <span className="text-base font-mono font-bold text-emerald-400">
                          ₹{(virtualBalance ?? 50000).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <button
                        onClick={handleDepositQuick}
                        className="px-2.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold rounded-lg border border-emerald-500/30 flex items-center gap-1 transition-all"
                      >
                        <PlusCircle size={13} />
                        <span>+₹50k</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Primary Navigation Links */}
                <div className="space-y-1.5 mb-6">
                  <p className="gsap-menu-item text-[10px] uppercase font-mono tracking-wider text-slate-400 px-3 mb-2 font-semibold">
                    Terminal Navigation
                  </p>

                  <Link
                    href="/"
                    onClick={closeMobileMenu}
                    className={`gsap-menu-item flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive('/')
                        ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <TrendingUp size={16} className={isActive('/') ? 'text-cyan-400' : 'text-slate-400'} />
                      <span>Market Overview</span>
                    </div>
                    <ChevronRight size={14} className="opacity-40" />
                  </Link>

                  <Link
                    href="/dashboard"
                    onClick={closeMobileMenu}
                    className={`gsap-menu-item flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive('/dashboard')
                        ? 'bg-gradient-to-r from-blue-600/30 to-indigo-600/30 text-white border border-indigo-500/40 shadow-inner'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <LayoutDashboard size={16} className="text-cyan-400" />
                      <span>Trading Terminal</span>
                    </div>
                    <span className="text-[10px] font-mono uppercase bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-bold">
                      Live
                    </span>
                  </Link>

                  <Link
                    href="/env-test"
                    onClick={closeMobileMenu}
                    className={`gsap-menu-item flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive('/env-test')
                        ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Activity size={16} className="text-emerald-400" />
                      <span>System Diagnostics</span>
                    </div>
                    <ChevronRight size={14} className="opacity-40" />
                  </Link>
                </div>

                {/* Markets Quick Badges */}
                <div className="gsap-menu-item p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 mb-6">
                  <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold mb-2.5">
                    Streaming Feeds
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                    <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                      <span className="text-slate-300">NSE / BSE</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                      <span className="text-slate-300">US Equities</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                      <span className="text-slate-300">Crypto Spot</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                      <span className="text-slate-300">Paper Exec</span>
                      <span className="text-[10px] text-cyan-400 font-bold">0ms</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions Section */}
              <div className="p-6 border-t border-white/10 bg-[#05080f]/80 relative z-10 space-y-3">
                {!isAuthenticated ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={closeMobileMenu}
                      className="py-2.5 text-center text-xs font-bold text-slate-200 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors uppercase tracking-wider"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={closeMobileMenu}
                      className="py-2.5 text-center text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 rounded-xl transition-all shadow-md shadow-cyan-500/20 uppercase tracking-wider"
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleLogoutClick}
                    className="w-full py-2.5 text-center text-xs font-bold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
                  >
                    <LogOut size={14} />
                    <span>Confirm Sign Out</span>
                  </button>
                )}

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                  <span>TRADEXPERT PLATFORM</span>
                  <span className="text-cyan-400 font-bold">STABLE v2.0</span>
                </div>
              </div>
            </aside>
          </>
        , document.body)}

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
