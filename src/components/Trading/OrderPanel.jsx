import React from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Wallet, TrendingUp, TrendingDown } from 'lucide-react'

export default function OrderPanel({ order, setOrder, placeOrder, balance }) {
  return (
    <aside className="col-span-1 lg:col-span-3 bg-white p-4 md:p-5 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" />
          <h3 className="text-base md:text-lg font-semibold text-slate-800">Order Panel</h3>
        </div>
        <div className="flex items-center gap-2 text-xs bg-slate-50 px-2 md:px-3 py-1.5 md:py-2 rounded-lg">
          <Wallet size={14} className="text-slate-600" />
          <span className="font-semibold text-slate-700">₹{(balance || 0).toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-3 md:space-y-4">
        <div className="flex gap-2 md:gap-3">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={()=>setOrder(o=>({...o, side:'Buy'}))} 
            className={`flex-1 py-2.5 md:py-3 rounded-lg text-sm md:text-base font-semibold transition-all flex items-center justify-center gap-2 ${
              order.side==='Buy' 
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <TrendingUp size={16} className="md:w-[18px] md:h-[18px]" />
            Buy
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={()=>setOrder(o=>({...o, side:'Sell'}))} 
            className={`flex-1 py-2.5 md:py-3 rounded-lg text-sm md:text-base font-semibold transition-all flex items-center justify-center gap-2 ${
              order.side==='Sell' 
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <TrendingDown size={16} className="md:w-[18px] md:h-[18px]" />
            Sell
          </motion.button>
        </div>

        <div className="grid grid-cols-2 gap-2 md:gap-3">
          <div>
            <label className="text-xs text-slate-600 mb-1 block font-medium">Order Type</label>
            <select 
              value={order.type} 
              onChange={e=>setOrder(o=>({...o, type:e.target.value}))} 
              className="w-full p-2 md:p-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option>Limit</option>
              <option>Market</option>
              <option>SL</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-600 mb-1 block font-medium">Quantity</label>
            <input 
              type="number" 
              value={order.qty} 
              onChange={e=>setOrder(o=>({...o, qty:+e.target.value}))} 
              className="w-full p-2 md:p-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
            />
          </div>
        </div>

        {order.type!=='Market' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <label className="text-xs text-slate-600 mb-1 block font-medium">Price</label>
            <input 
              placeholder="Enter price" 
              value={order.price} 
              onChange={e=>setOrder(o=>({...o, price:e.target.value}))} 
              className="w-full p-2 md:p-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
            />
          </motion.div>
        )}

        <div className="flex gap-2 md:gap-3 pt-2">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={placeOrder} 
            className="flex-1 py-2.5 md:py-3 text-sm md:text-base rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Place Order
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={()=>setOrder({ type: 'Limit', side: 'Buy', qty: 1, price: '' })} 
            className="px-3 md:px-5 py-2.5 md:py-3 text-sm md:text-base rounded-lg bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-all"
          >
            Reset
          </motion.button>
        </div>
      </div>
    </aside>
  )
}
