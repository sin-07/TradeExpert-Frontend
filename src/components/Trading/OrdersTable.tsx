'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, TrendingUp, TrendingDown, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function OrdersTable({ orders = [] }) {
  const [filter, setFilter] = useState('all');

  const filteredOrders = orders.filter((order) => {
    if (filter === 'buy') return (order.side || '').toLowerCase() === 'buy';
    if (filter === 'sell') return (order.side || '').toLowerCase() === 'sell';
    return true;
  });

  return (
    <div className="bg-[#0b101b] rounded-2xl border border-white/10 shadow-2xl p-5 flex flex-col justify-between">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5 mb-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <BookOpen size={17} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">Order Execution History</h4>
            <p className="text-[10px] font-mono text-slate-400">All Filled &amp; Pending Orders</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-white/10 text-xs">
          {['all', 'buy', 'sell'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg uppercase tracking-wider font-mono text-[11px] font-bold transition-all ${
                filter === f
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto min-h-[180px]">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              <th className="text-left py-2.5 px-2">Time</th>
              <th className="text-left py-2.5 px-2">Instrument</th>
              <th className="text-center py-2.5 px-2">Action</th>
              <th className="text-right py-2.5 px-2">Qty</th>
              <th className="text-right py-2.5 px-2">Price</th>
              <th className="text-right py-2.5 px-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-500">
                    <div className="w-12 h-12 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400">
                      <Clock size={20} />
                    </div>
                    <p className="text-sm font-semibold text-slate-300">No Orders Executed</p>
                    <p className="text-xs text-slate-500">Orders placed in this session will be recorded here.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order, idx) => {
                const isBuy = (order.side || '').toLowerCase() === 'buy';

                return (
                  <motion.tr
                    key={order.id || idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-900/40 transition-colors"
                  >
                    <td className="py-2.5 px-2 text-slate-500 text-[11px]">
                      {order.time || 'Today'}
                    </td>
                    <td className="py-2.5 px-2 font-sans font-bold text-white">
                      {(order.symbol || '').replace('.NS', '').replace('.BO', '')}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          isBuy
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
                        }`}
                      >
                        {isBuy ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {order.side?.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-right py-2.5 px-2 text-slate-200">
                      {order.qty}
                    </td>
                    <td className="text-right py-2.5 px-2 font-bold text-white">
                      ₹{Number(order.price || 0).toFixed(2)}
                    </td>
                    <td className="text-right py-2.5 px-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                        <CheckCircle2 size={12} />
                        Filled
                      </span>
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
