'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#070b12] text-slate-100 flex items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 rounded-3xl bg-[#0b101b] border border-white/10 space-y-4">
          <h2 className="text-2xl font-bold text-rose-400">Terminal Exception</h2>
          <p className="text-xs text-slate-400 font-mono">{error?.message || 'Critical application failure'}</p>
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
          >
            Re-initialize Terminal
          </button>
        </div>
      </body>
    </html>
  );
}

