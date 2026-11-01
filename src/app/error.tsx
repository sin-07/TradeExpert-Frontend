'use client';

import React from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#070b12] text-slate-100 selection:bg-cyan-500 selection:text-black">
      <main className="flex-1 container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="w-full max-w-md p-8 rounded-3xl bg-[#0b101b] border border-white/10 shadow-2xl space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400 font-mono text-2xl font-black">
            500
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">System Exception</h2>
          <p className="text-xs text-slate-400 leading-relaxed font-mono">
            {error?.message || 'An unexpected terminal error occurred.'}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition"
            >
              Retry
            </button>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 font-bold text-xs uppercase tracking-wider transition border border-white/10"
            >
              Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

