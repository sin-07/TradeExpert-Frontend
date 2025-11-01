import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Package, AlertCircle } from 'lucide-react'

export default function PositionsTable({ positions, currentPrices = {} }) {
  const calculatePnL = (position) => {
    const currentPrice = parseFloat(currentPrices[position.symbol]?.price || position.avg)
    const pnl = (currentPrice - position.avg) * position.qty
    const pnlPercent = ((currentPrice - position.avg) / position.avg) * 100
    return { pnl, pnlPercent, currentPrice }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-5">
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-5 h-5 text-indigo-600" />
        <h4 className="text-lg font-semibold text-slate-800">Open Positions</h4>
        {positions.length > 0 && (
          <span className="ml-auto text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full font-medium">
            {positions.length} {positions.length === 1 ? 'Position' : 'Positions'}
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-slate-200">
              <th className="text-left py-3 px-2 text-slate-600 font-semibold text-xs uppercase tracking-wider">Symbol</th>
              <th className="text-center py-3 px-2 text-slate-600 font-semibold text-xs uppercase tracking-wider">Side</th>
              <th className="text-right py-3 px-2 text-slate-600 font-semibold text-xs uppercase tracking-wider">Qty</th>
              <th className="text-right py-3 px-2 text-slate-600 font-semibold text-xs uppercase tracking-wider">Avg Price</th>
              <th className="text-right py-3 px-2 text-slate-600 font-semibold text-xs uppercase tracking-wider">LTP</th>
              <th className="text-right py-3 px-2 text-slate-600 font-semibold text-xs uppercase tracking-wider">P&L</th>
            </tr>
          </thead>
          <tbody>
            {positions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-medium">No open positions</p>
                    <p className="text-slate-400 text-xs">Start trading to see your positions here</p>
                  </div>
                </td>
              </tr>
            ) : (
              positions.map((p, index) => {
                const { pnl, pnlPercent, currentPrice } = calculatePnL(p)
                const isProfit = pnl >= 0
                
                return (
                  <motion.tr 
                    key={p.symbol + index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-3 px-2">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">{p.symbol}</span>
                        <span className="text-xs text-slate-500">{p.side === 'Buy' ? 'Long' : 'Short'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        p.side === 'Buy' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {p.side === 'Buy' ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {p.side}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right font-medium text-slate-700">
                      {p.qty}
                    </td>
                    <td className="py-3 px-2 text-right font-medium text-slate-700">
                      ₹{Number(p.avg).toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-right font-medium text-slate-800">
                      ₹{currentPrice.toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex flex-col items-end">
                        <span className={`font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                          {isProfit ? '+' : ''}₹{Math.abs(pnl).toFixed(2)}
                        </span>
                        <span className={`text-xs font-medium ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                          ({isProfit ? '+' : ''}{pnlPercent.toFixed(2)}%)
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {positions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600 font-medium">Total P&L:</span>
            <span className={`text-lg font-bold ${
              positions.reduce((sum, p) => sum + calculatePnL(p).pnl, 0) >= 0 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {positions.reduce((sum, p) => sum + calculatePnL(p).pnl, 0) >= 0 ? '+' : ''}
              ₹{Math.abs(positions.reduce((sum, p) => sum + calculatePnL(p).pnl, 0)).toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
