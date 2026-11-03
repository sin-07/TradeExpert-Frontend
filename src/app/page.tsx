'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Users, 
  CheckCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Cpu, 
  Sparkles, 
  Wallet, 
  Layers,
  Activity 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import useIndianStockPrices from '@/hooks/useIndianStockPrices';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // GSAP Left-Right Animation Refs
  const heroBadgeRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubtitleRef = useRef(null);
  const heroActionsRef = useRef(null);
  const heroStatsRef = useRef(null);
  const radarLeftRef = useRef(null);
  const radarRightRef = useRef(null);
  const stockGridRef = useRef(null);
  const featureHeaderRef = useRef(null);
  const featureCard1Ref = useRef(null);
  const featureCard2Ref = useRef(null);
  const featureCard3Ref = useRef(null);

  // Top Indian stocks for real-time ticker
  const [niftyStocks] = useState([
    'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'ICICIBANK.NS',
    'HINDUNILVR.NS', 'ITC.NS', 'SBIN.NS', 'BHARTIARTL.NS', 'KOTAKBANK.NS',
    'LT.NS', 'AXISBANK.NS', 'ASIANPAINT.NS', 'MARUTI.NS', 'TATAMOTORS.NS'
  ]);

  const { prices, loading } = useIndianStockPrices(niftyStocks);
  const [stockList, setStockList] = useState([]);

  useEffect(() => {
    if (Object.keys(prices).length > 0) {
      const stocks = niftyStocks
        .map((sym) => ({
          symbol: sym,
          name: prices[sym]?.shortName || sym.replace('.NS', ''),
          ltp: parseFloat(prices[sym]?.price || 0),
          change: parseFloat(prices[sym]?.change || 0),
        }))
        .filter((s) => s.ltp > 0);
      setStockList(stocks);
    }
  }, [prices, niftyStocks]);

  // GSAP Left-to-Right & Right-to-Left Entrance Animations
  useEffect(() => {
    // 1. Hero Left-to-Right reveal
    if (heroBadgeRef.current && heroTitleRef.current && heroSubtitleRef.current) {
      gsap.fromTo(
        [heroBadgeRef.current, heroTitleRef.current, heroSubtitleRef.current],
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' }
      );
    }

    // 2. Hero Right-to-Left reveal
    if (heroActionsRef.current && heroStatsRef.current) {
      gsap.fromTo(
        [heroActionsRef.current, heroStatsRef.current],
        { opacity: 0, x: 60 },
        { opacity: 1, x: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
      );
    }

    // 3. Live Radar Left-Right Split
    if (radarLeftRef.current && radarRightRef.current) {
      gsap.fromTo(
        radarLeftRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', delay: 0.3 }
      );
      gsap.fromTo(
        radarRightRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', delay: 0.3 }
      );
    }

    // 4. Feature Cards: Left Card from Left, Center from Bottom, Right Card from Right
    if (featureCard1Ref.current && featureCard2Ref.current && featureCard3Ref.current) {
      gsap.fromTo(
        featureCard1Ref.current,
        { opacity: 0, x: -70 },
        { opacity: 1, x: 0, duration: 0.85, ease: 'power3.out', delay: 0.35 }
      );
      gsap.fromTo(
        featureCard2Ref.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out', delay: 0.45 }
      );
      gsap.fromTo(
        featureCard3Ref.current,
        { opacity: 0, x: 70 },
        { opacity: 1, x: 0, duration: 0.85, ease: 'power3.out', delay: 0.55 }
      );
    }
  }, []);

  // Alternating Left-Right Stagger for Live Stock Cards
  useEffect(() => {
    if (stockGridRef.current && stockList.length > 0) {
      const cards = stockGridRef.current.children;
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          x: (i) => (i % 2 === 0 ? -40 : 40),
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power3.out',
        }
      );
    }
  }, [stockList]);

  return (
    <div className="min-h-screen flex flex-col bg-[#070b12] text-slate-100 selection:bg-cyan-500 selection:text-black">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32 border-b border-white/5">
          {/* Background Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/20 to-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[90px] pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              {/* Badge (Slides in from Left) */}
              <div
                ref={heroBadgeRef}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900/90 border border-white/10 shadow-xl"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-semibold text-slate-300">
                  TradeXpert 2.0 • Live Paper Trading Platform
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 uppercase">
                  Zero Risk
                </span>
              </div>

              {/* Title (Slides in from Left) */}
              <h1
                ref={heroTitleRef}
                className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] text-white"
              >
                Next-Gen Trading Terminal For{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">
                  Modern Traders
                </span>
              </h1>

              {/* Subtitle (Slides in from Left) */}
              <p
                ref={heroSubtitleRef}
                className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
              >
                Master NSE Equities, US Tech Stocks, and Cryptocurrencies with real-time feeds,
                sub-100ms order simulation, and ₹50,000 starting virtual balance.
              </p>

              {/* Action Buttons (Slide in from Right) */}
              <div
                ref={heroActionsRef}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
              >
                <Link
                  href={isAuthenticated ? '/dashboard' : '/signup'}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <BarChart3 size={18} />
                  <span>{isAuthenticated ? 'Open Trading Terminal' : 'Start Trading Now'}</span>
                </Link>

                <Link
                  href="/login"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm bg-slate-900/90 hover:bg-slate-800 text-white border border-white/10 hover:border-white/20 shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Sign In to Account</span>
                  <ArrowUpRight size={16} />
                </Link>
              </div>

              {/* Key Platform Stats (Slide in from Right) */}
              <div
                ref={heroStatsRef}
                className="grid grid-cols-3 gap-4 pt-10 border-t border-white/5 max-w-2xl mx-auto"
              >
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-black font-mono text-white">₹50,000</p>
                  <p className="text-xs text-slate-500 mt-0.5">Virtual Capital</p>
                </div>
                <div className="text-center border-x border-white/5">
                  <p className="text-xl sm:text-2xl font-black font-mono text-emerald-400">&lt;50ms</p>
                  <p className="text-xs text-slate-500 mt-0.5">Execution Engine</p>
                </div>
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-black font-mono text-cyan-400">100%</p>
                  <p className="text-xs text-slate-500 mt-0.5">Risk-Free Simulation</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Top Movers Ticker Grid */}
        <section className="py-16 container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
            <div ref={radarLeftRef}>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase font-bold tracking-wider mb-1">
                <Activity size={14} />
                Live Market Radar
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                NSE Top Equities
              </h2>
            </div>

            <div ref={radarRightRef}>
              <Link
                href="/dashboard"
                className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                Open Full Terminal →
              </Link>
            </div>
          </div>

          {loading && stockList.length === 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-28 rounded-2xl bg-slate-900/60 border border-white/5 skeleton" />
              ))}
            </div>
          ) : (
            <div ref={stockGridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {stockList.slice(0, 10).map((stock) => {
                const isUp = stock.change >= 0;

                return (
                  <motion.div
                    key={stock.symbol}
                    whileHover={{ y: -3 }}
                    onClick={() => router.push('/dashboard')}
                    className="p-4 rounded-2xl bg-[#0b101b] border border-white/5 hover:border-white/15 cursor-pointer shadow-lg hover:shadow-cyan-500/5 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">
                          {stock.symbol.replace('.NS', '')}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate max-w-[90px]">{stock.name}</p>
                      </div>
                      <div
                        className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                          isUp
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {isUp ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                        {Math.abs(stock.change).toFixed(2)}%
                      </div>
                    </div>

                    <div className="mt-3 flex items-baseline justify-between font-mono">
                      <span className="text-base font-extrabold text-white">
                        ₹{stock.ltp.toFixed(2)}
                      </span>
                      <span className={`w-1.5 h-1.5 rounded-full ${isUp ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        {/* Feature Grid with GSAP Left, Center, Right Entrance */}
        <section className="py-20 bg-[#05080f] border-t border-white/5">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">
                Professional Toolkit
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Engineered for serious paper trading
              </h2>
              <p className="text-slate-400 text-sm">
                Everything you need to test market hypotheses and refine risk management strategies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1: From Left */}
              <div
                ref={featureCard1Ref}
                className="p-6 rounded-2xl bg-[#0b101b] border border-white/5 shadow-xl space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-lg font-bold text-white">Live Market Data Feeds</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time price ticks from National Stock Exchange (NSE), NASDAQ Top 100, and Binance Spot WebSockets.
                </p>
              </div>

              {/* Feature 2: From Center Bottom */}
              <div
                ref={featureCard2Ref}
                className="p-6 rounded-2xl bg-[#0b101b] border border-white/5 shadow-xl space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <BarChart3 size={24} />
                </div>
                <h3 className="text-lg font-bold text-white">Advanced Interactive Charts</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Toggle seamlessly between Area, Line, and Candlestick views with timeframes ranging from 1D to 1 Year.
                </p>
              </div>

              {/* Feature 3: From Right */}
              <div
                ref={featureCard3Ref}
                className="p-6 rounded-2xl bg-[#0b101b] border border-white/5 shadow-xl space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-lg font-bold text-white">Instant Virtual Faucet</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Run out of virtual cash? Top up ₹50,000 anytime with 1-click to test larger position sizes and portfolio rebalancing.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
