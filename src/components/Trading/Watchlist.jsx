import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight, Search, Plus, X, TrendingUp } from 'lucide-react'

// Get API URL from environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function Watchlist({ watchlist, onSelect, selected, onAddStock }) {
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  const filtered = watchlist.filter(w => 
    w.symbol.toLowerCase().includes(search.toLowerCase()) ||
    w.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSearch = async (query) => {
    setSearch(query)
    
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    setSearching(true)
    try {
      const response = await fetch(`${API_URL}/search/search?query=${encodeURIComponent(query)}`)
      const data = await response.json()
      setSearchResults(data.results || [])
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }

  const handleAddStock = (stock) => {
    onAddStock(stock.symbol)
    setSearch('')
    setSearchResults([])
    setShowSearch(false)
  }

  return (
    <aside className="col-span-1 lg:col-span-3 bg-white rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" />
          <h2 className="text-base md:text-lg font-semibold text-slate-800">Watchlist</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: showSearch ? 0 : 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowSearch(!showSearch)}
          className="p-2 hover:bg-indigo-50 rounded-lg transition-colors"
          title="Add stock"
        >
          {showSearch ? <X className="w-5 h-5 text-slate-600" /> : <Plus className="w-5 h-5 text-indigo-600" />}
        </motion.button>
      </div>

      <AnimatePresence>
        {showSearch && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search stocks..."
                className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                autoFocus
              />
            </div>

            {searching && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-xs text-slate-500 text-center"
              >
                Searching...
              </motion.div>
            )}

            <AnimatePresence>
              {searchResults.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-2 max-h-48 overflow-y-auto border border-slate-200 rounded-lg shadow-md"
                >
                  {searchResults.map((stock, index) => (
                    <motion.div
                      key={stock.symbol}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleAddStock(stock)}
                      className="flex items-center justify-between p-3 hover:bg-indigo-50 cursor-pointer border-b border-slate-100 last:border-b-0 transition-colors"
                    >
                      <div>
                        <div className="text-sm font-medium">{stock.symbol}</div>
                        <div className="text-xs text-slate-500">{stock.name}</div>
                      </div>
                      <Plus className="w-4 h-4 text-indigo-600" />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-1 max-h-[500px] overflow-y-auto">
        {filtered.map((item, index) => (
          <motion.div
            key={item.symbol}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02, x: 4 }}
            onClick={() => onSelect(item)}
            className={`p-3 rounded-lg cursor-pointer transition-all ${
              selected?.symbol === item.symbol
                ? 'bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-indigo-600 shadow-md'
                : 'hover:bg-slate-50 border-l-4 border-transparent'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-slate-800">{item.symbol}</span>
              <motion.div
                animate={{ 
                  y: item.change >= 0 ? [-2, 0] : [2, 0],
                }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                {item.change >= 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                )}
              </motion.div>
            </div>
            <div className="text-xs text-slate-600 mb-1">{item.name}</div>
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-slate-900">₹{item.ltp.toFixed(2)}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                item.change >= 0 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </aside>
  )
}

