'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Search, Plus, X, Layers, Activity } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export default function Watchlist({ watchlist = [], onSelect, selected, onAddStock }) {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const filtered = watchlist.filter((w) =>
    (w.symbol || '').toLowerCase().includes(search.toLowerCase()) ||
    (w.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleSearch = async (query) => {
    setSearch(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const response = await fetch(`${API_URL}/search/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleAdd = (stock) => {
    if (onAddStock) onAddStock(stock);
    setSearch('');
    setSearchResults([]);
    setShowSearch(false);
  };

  return (
    <aside className="col-span-12 lg:col-span-2 bg-[#0b101b] rounded-2xl border border-white/10 shadow-2xl p-4 flex flex-col h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-white tracking-tight">Market Watch</h2>
        </div>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className={`p-1.5 rounded-lg transition-colors ${
            showSearch ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          title="Search & Add Stock"
        >
          {showSearch ? <X size={16} /> : <Plus size={16} />}
        </button>
      </div>

      {/* Inline Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 space-y-2 overflow-hidden"
          >
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Find symbol (e.g. INFY)..."
                className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                autoFocus
              />
            </div>

            {searching && (
              <div className="text-[11px] text-slate-400 px-2 flex items-center gap-1.5">
                <div className="w-3 h-3 border border-cyan-400 border-t-transparent rounded-full animate-spin" />
                Scanning markets...
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="max-h-40 overflow-y-auto space-y-1 bg-slate-950 p-2 rounded-xl border border-white/10">
                {searchResults.map((stock) => (
                  <div
                    key={stock.symbol}
                    onClick={() => handleAdd(stock)}
                    className="p-1.5 hover:bg-slate-900 rounded-lg flex items-center justify-between cursor-pointer text-xs"
                  >
                    <div>
                      <p className="font-bold text-white">{stock.symbol}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{stock.name}</p>
                    </div>
                    <span className="p-1 text-cyan-400 hover:text-cyan-300">
                      <Plus size={14} />
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stock Tickers List */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-500">
            No instruments found.
          </div>
        ) : (
          filtered.map((stock) => {
            const isSelected = selected?.symbol === stock.symbol;
            const isUp = (stock.change ?? 0) >= 0;

            return (
              <motion.div
                key={stock.symbol}
                whileHover={{ x: 2 }}
                onClick={() => onSelect(stock)}
                className={`p-2.5 rounded-xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500/15 to-indigo-500/10 border-cyan-500/40 shadow-lg shadow-cyan-500/5'
                    : 'bg-slate-900/40 hover:bg-slate-900/80 border-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-white tracking-wide">
                        {stock.symbol.replace('.NS', '').replace('.BO', '')}
                      </span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate max-w-[110px] mt-0.5">
                      {stock.name || stock.symbol}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-mono text-xs font-bold text-slate-100">
                      ₹{Number(stock.ltp || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <div
                      className={`inline-flex items-center text-[10px] font-mono font-semibold ${
                        isUp ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isUp ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                      {Math.abs(Number(stock.change || 0)).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Watchlist Footer */}
      <div className="pt-2 border-t border-white/5 text-[10px] text-slate-500 flex justify-between items-center font-mono">
        <span>{filtered.length} Instruments</span>
        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
          <Activity size={10} /> Auto-Syncing
        </span>
      </div>
    </aside>
  );
}
