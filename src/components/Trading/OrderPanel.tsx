'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PlusCircle, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrderPanel({ 
  order, 
  setOrder, 
  placeOrder, 
  balance = 50000, 
  loading = false,
  selectedStockPrice = 0,
  onQuickDeposit 
}) {
  const price = parseFloat(order.price) || parseFloat(selectedStockPrice) || 1000;
  const quantity = Math.max(1, parseInt(order.qty, 10) || 1);
  const totalCost = parseFloat((price * quantity).toFixed(2));
  const isBuy = order.side === 'Buy';
  const hasSufficientBalance = !isBuy || (balance >= totalCost);

  // Quick percentage allocation
  const handlePercentageSelect = (pct) => {
    if (price <= 0) return;
    const maxQty = Math.max(1, Math.floor((balance * (pct / 100)) / price));
    setOrder((prev) => ({ ...prev, qty: maxQty }));
  };

  const handleIncrement = (amount) => {
    setOrder((prev) => ({ ...prev, qty: Math.max(1, (parseInt(prev.qty, 10) || 0) + amount) }));
  };

  return (
    <aside className="col-span-12 lg:col-span-3 bg-[#0b101b] p-5 rounded-2xl border border-white/10 shadow-2xl flex flex-col justify-between">
      <div>
        {/* Header: Title and Balance Pill */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isBuy ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              <Zap size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Order Execution</h3>
              <p className="text-[10px] font-mono text-slate-400">Instant Execution</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10">
            <Wallet size={13} className="text-emerald-400" />
            <span className="font-mono text-xs font-bold text-white">
              ₹{(balance || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </span>
            {onQuickDeposit && (
              <button
                onClick={onQuickDeposit}
                title="Add ₹50,000 Funds"
                className="text-cyan-400 hover:text-cyan-300 ml-1"
              >
                <PlusCircle size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Side Tabs: BUY / SELL */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-white/5 mb-4">
          <button
            type="button"
            onClick={() => setOrder((o) => ({ ...o, side: 'Buy' }))}
            className={`py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              isBuy
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp size={15} />
            BUY (LONG)
          </button>
          <button
            type="button"
            onClick={() => setOrder((o) => ({ ...o, side: 'Sell' }))}
            className={`py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              !isBuy
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingDown size={15} />
            SELL (SHORT)
          </button>
        </div>

        {/* Form Inputs */}
        <div className="space-y-3.5">
          {/* Order Type & Price Input */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Order Type</label>
              <select
                value={order.type}
                onChange={(e) => setOrder((o) => ({ ...o, type: e.target.value }))}
                className="w-full py-2 px-3 bg-slate-900 border border-white/10 rounded-xl text-xs font-medium text-white outline-none focus:border-cyan-500"
              >
                <option value="Limit">Limit Order</option>
                <option value="Market">Market Order</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Price (₹)</label>
              <input
                type="number"
                step="0.05"
                disabled={order.type === 'Market'}
                value={order.type === 'Market' ? '' : order.price}
                placeholder={price ? price.toFixed(2) : '0.00'}
                onChange={(e) => setOrder((o) => ({ ...o, price: e.target.value }))}
                className="w-full py-2 px-3 bg-slate-900 border border-white/10 rounded-xl text-xs font-mono font-medium text-white outline-none focus:border-cyan-500 disabled:opacity-60"
              />
            </div>
          </div>

          {/* Quantity Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-semibold text-slate-400">Shares / Quantity</label>
              <span className="text-[10px] font-mono text-slate-400">Min: 1</span>
            </div>
            <input
              type="number"
              min="1"
              value={order.qty}
              onChange={(e) => setOrder((o) => ({ ...o, qty: Math.max(1, parseInt(e.target.value, 10) || 1) }))}
              className="w-full py-2.5 px-3 bg-slate-900 border border-white/10 rounded-xl text-sm font-mono font-bold text-white outline-none focus:border-indigo-500"
            />
          </div>

          {/* Quick Increments */}
          <div className="grid grid-cols-4 gap-1.5">
            {[1, 5, 25, 100].map((inc) => (
              <button
                key={inc}
                type="button"
                onClick={() => handleIncrement(inc)}
                className="py-1 px-1.5 rounded-lg bg-white/5 border border-white/5 text-[11px] font-mono text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                +{inc}
              </button>
            ))}
          </div>

          {/* Quick Balance Allocation % Buttons (for Buy) */}
          {isBuy && (
            <div>
              <div className="text-[10px] text-slate-400 mb-1 font-medium">Use Balance %</div>
              <div className="grid grid-cols-4 gap-1.5">
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handlePercentageSelect(pct)}
                    className="py-1 text-[11px] font-mono font-semibold rounded-lg bg-slate-900 border border-white/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Transaction Summary Card */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5 space-y-2 mt-2">
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>Required Margin:</span>
              <span className="text-white">₹{totalCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>Estimated Fees:</span>
              <span className="text-emerald-400">₹0.00 (Free Demo)</span>
            </div>
            <div className="pt-2 border-t border-white/5 flex justify-between items-baseline font-mono">
              <span className="text-xs font-bold text-slate-300">Total Value:</span>
              <span className="text-base font-black text-white">₹{totalCost.toFixed(2)}</span>
            </div>
          </div>

          {!hasSufficientBalance && (
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              <ShieldAlert size={14} className="shrink-0" />
              <span>Insufficient virtual funds for this order.</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Order Execute Button */}
      <div className="mt-4 pt-3 border-t border-white/5">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          disabled={loading || (isBuy && !hasSufficientBalance)}
          onClick={placeOrder}
          className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            isBuy
              ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white shadow-emerald-600/30 hover:shadow-emerald-600/50'
              : 'bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 text-white shadow-rose-600/30 hover:shadow-rose-600/50'
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              {isBuy ? <CheckCircle2 size={16} /> : <TrendingDown size={16} />}
              <span>{isBuy ? `BUY ${order.qty} SHARES` : `SELL ${order.qty} SHARES`}</span>
            </>
          )}
        </motion.button>
      </div>
    </aside>
  );
}
