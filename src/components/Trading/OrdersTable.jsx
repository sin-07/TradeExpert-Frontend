import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, TrendingUp, TrendingDown, Clock, CheckCircle, AlertCircle, Filter } from 'lucide-react'

export default function OrdersTable({ orders }) {
  const [filter, setFilter] = useState('all') // all, buy, sell

  const filteredOrders = orders.filter(order => {
    if (filter === 'buy') return order.side === 'Buy'
    if (filter === 'sell') return order.side === 'Sell'
    return true
  })

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'filled': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-slate-600 bg-slate-100'
    }
  }

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'filled': return <CheckCircle className="w-3 h-3" />
      case 'pending': return <Clock className="w-3 h-3" />
      case 'cancelled': return <AlertCircle className="w-3 h-3" />
      default: return null
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <h4 className="text-lg font-semibold text-slate-800">Order Book</h4>
          {orders.length > 0 && (
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium">
              {filteredOrders.length} {filteredOrders.length === 1 ? 'Order' : 'Orders'}
            </span>
          )}
        </div>

        {orders.length > 0 && (
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                filter === 'all' 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('buy')}
              className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                filter === 'buy' 
                  ? 'bg-green-500 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setFilter('sell')}
              className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                filter === 'sell' 
                  ? 'bg-red-500 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Sell
            </button>
          </div>
        )}
      </div>

      <div className="max-h-80 overflow-auto">
        {filteredOrders.length === 0 ? (
          <div className="py-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">
                {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
              </p>
              <p className="text-slate-400 text-xs">
                {filter === 'all' 
                  ? 'Place your first order to start trading' 
                  : 'Try changing the filter'
                }
              </p>
            </div>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 px-2 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                  Time
                </th>
                <th className="text-left py-3 px-2 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                  Symbol
                </th>
                <th className="text-center py-3 px-2 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                  Side
                </th>
                <th className="text-right py-3 px-2 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                  Qty
                </th>
                <th className="text-right py-3 px-2 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                  Price
                </th>
                <th className="text-center py-3 px-2 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        {order.time}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="font-semibold text-slate-800">{order.symbol}</span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        order.side === 'Buy' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {order.side === 'Buy' ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {order.side}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right font-medium text-slate-700">
                      {order.qty}
                    </td>
                    <td className="py-3 px-2 text-right font-medium text-slate-800">
                      {typeof order.price === 'string' && order.price === 'MKT' 
                        ? <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">MKT</span>
                        : `₹${Number(order.price).toFixed(2)}`
                      }
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status || 'Filled'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </div>

      {filteredOrders.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-slate-500 mb-1">Total Orders</p>
              <p className="text-lg font-bold text-slate-800">{filteredOrders.length}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Buy Orders</p>
              <p className="text-lg font-bold text-green-600">
                {filteredOrders.filter(o => o.side === 'Buy').length}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Sell Orders</p>
              <p className="text-lg font-bold text-red-600">
                {filteredOrders.filter(o => o.side === 'Sell').length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
