'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, AlertCircle, ArrowUpRight, ArrowDownRight, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function PositionsTable({ positions = [], currentPrices = {}, onPositionClosed }) {
  const [closingSymbol, setClosingSymbol] = useState(null);

  const calculatePnL = (position) => {
    const currentPrice = parseFloat(currentPrices[position.symbol]?.price || position.avg || 0);
    const avg = position.avg || 1;
    const qty = position.qty || 0;
    const pnl = (currentPrice - avg) * qty;
    const pnlPercent = avg > 0 ? ((currentPrice - avg) / avg) * 100 : 0;
    return { pnl, pnlPercent, currentPrice };
  };

  const handleClosePosition = async (position, currentPrice) => {
    setClosingSymbol(position.symbol);
    const toastId = toast.loading(`Closing position in ${position.symbol}...`);
    try {
      const res = await api.closePosition(position.symbol, currentPrice);
      toast.success(res.message || 'Position closed successfully', { id: toastId });
      if (onPositionClosed) onPositionClosed();
    } catch (err) {
      toast.error(err.message || 'Failed to close position', { id: toastId });
    } finally {
      setClosingSymbol(null);
    }
  };

  return (
    <div className="bg-[#0b101b] rounded-2xl border border-white/10 shadow-2xl p-5 flex flex-col justify-between">
      {/* Table Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Package size={17} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">Active Portfolio Holdings</h4>
            <p className="text-[10px] font-mono text-slate-400">Live Mark-to-Market P&L</p>
          </div>
        </div>

        {positions.length > 0 && (
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            {positions.length} Active {positions.length === 1 ? 'Asset' : 'Assets'}
          </span>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-[180px]">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              <th className="text-left py-2.5 px-2">Instrument</th>
              <th className="text-center py-2.5 px-2">Qty</th>
              <th className="text-right py-2.5 px-2">Avg Buy</th>
              <th className="text-right py-2.5 px-2">LTP</th>
              <th className="text-right py-2.5 px-2">Unrealized P&L</th>
              <th className="text-right py-2.5 px-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono">
            {positions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-500">
                    <div className="w-12 h-12 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400">
                      <AlertCircle size={22} />
                    </div>
                    <p className="text-sm font-semibold text-slate-300">No Open Positions</p>
                    <p className="text-xs text-slate-500">Use the Order Panel on the right to execute your first trade!</p>
                  </div>
                </td>
              </tr>
            ) : (
              positions.map((p, index) => {
                const { pnl, pnlPercent, currentPrice } = calculatePnL(p);
                const isProfit = pnl >= 0;
                const isClosing = closingSymbol === p.symbol;

                return (
                  <motion.tr
                    key={p.symbol + index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-900/40 transition-colors"
                  >
                    <td className="py-3 px-2 font-sans font-bold text-white">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        {p.symbol.replace('.NS', '').replace('.BO', '')}
                      </div>
                    </td>
                    <td className="text-center py-3 px-2 text-slate-300">
                      {p.qty}
                    </td>
                    <td className="text-right py-3 px-2 text-slate-400">
                      ₹{Number(p.avg).toFixed(2)}
                    </td>
                    <td className="text-right py-3 px-2 font-bold text-white">
                      ₹{currentPrice.toFixed(2)}
                    </td>
                    <td className="text-right py-3 px-2">
                      <div className={`font-bold flex items-center justify-end gap-1 ${
                        isProfit ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {isProfit ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                        <span>{isProfit ? '+' : ''}₹{pnl.toFixed(2)} ({pnlPercent.toFixed(2)}%)</span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-2">
                      <button
                        onClick={() => handleClosePosition(p, currentPrice)}
                        disabled={isClosing}
                        className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-400 text-[11px] font-sans font-semibold rounded-lg transition-all disabled:opacity-50"
                      >
                        {isClosing ? 'Closing...' : 'Exit'}
                      </button>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
