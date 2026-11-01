'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, RefreshCw } from 'lucide-react';

export default function EnvTestPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const testHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/health`);
      const data = await res.json();
      setResponse({ status: res.status, data });
    } catch (err) {
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 p-6 md:p-12 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-[#0b101b] border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">System Diagnostics</h1>
            <p className="text-xs text-slate-400">Environment &amp; API Connectivity Status</p>
          </div>
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <ArrowLeft size={14} /> Back to Terminal
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">NEXT_PUBLIC_API_URL</p>
            <p className="text-sm font-mono text-cyan-300 mt-1">{apiUrl}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">ENVIRONMENT</p>
            <p className="text-sm font-mono text-emerald-400 mt-1">Production Ready (Unified Fullstack)</p>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={testHealth}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Probing /api/health...' : 'Test Database & API Health'}</span>
          </button>

          {response && (
            <div className="mt-4 p-4 rounded-2xl bg-black/50 border border-white/10 font-mono text-xs overflow-auto">
              <pre className="text-cyan-400">{JSON.stringify(response, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
