'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, ShieldCheck, Cpu, Globe2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#05080f] border-t border-white/5 py-10 text-slate-400 text-sm">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <TrendingUp size={18} />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">TradeXpert</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Professional-grade paper trading platform for Indian Equities, US Tech Stocks, and Cryptocurrencies.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Markets</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-white transition-colors cursor-pointer">NSE Nifty 50 Real-time</li>
              <li className="hover:text-white transition-colors cursor-pointer">BSE Sensex Live Data</li>
              <li className="hover:text-white transition-colors cursor-pointer">US Tech Equities (NASDAQ)</li>
              <li className="hover:text-white transition-colors cursor-pointer">Binance Crypto Streams</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Trading Terminal</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Market Insights</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Account Access</Link></li>
              <li><Link href="/env-test" className="hover:text-white transition-colors">System Diagnostics</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Trust & Security</h4>
            <div className="space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck size={14} />
                <span>Simulated Risk-Free Trading</span>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-400">
                <Cpu size={14} />
                <span>Sub-100ms Order Execution</span>
              </div>
              <div className="flex items-center gap-1.5 text-indigo-400">
                <Globe2 size={14} />
                <span>Global Multi-Market Feeds</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TradeXpert Inc. Simulated Trading Platform for Educational Purposes.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">API Docs</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
