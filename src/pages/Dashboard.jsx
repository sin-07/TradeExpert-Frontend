import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, Activity, Wallet, BarChart3, Clock, Search, Plus, X } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Watchlist from '../components/Trading/Watchlist'
import ChartView from '../components/Trading/ChartView'
import OrderPanel from '../components/Trading/OrderPanel'
import OrdersTable from '../components/Trading/OrdersTable'
import PositionsTable from '../components/Trading/PositionsTable'
import useIndianStockPrices from '../hooks/useIndianStockPrices'
import useCryptoPrices from '../hooks/useCryptoPrices'

// Get API URL from environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const generatePriceSeries = () => {
  const series = []
  let price = 1000
  for (let i = 0; i < 50; i++) {
    const change = (Math.random() - 0.4) * 4
    price = Math.max(10, +(price + change).toFixed(2))
    series.push({ time: `${i}`, price })
  }
  return series
}

export default function Dashboard(){
  const { user, isAuthenticated } = useAuth()
  
  // Market tabs
  const [activeMarket, setActiveMarket] = useState('indian') // 'indian', 'us', 'crypto'
  
  // Indian stocks
  const [indianSymbols, setIndianSymbols] = useState(['RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'ICICIBANK.NS', 'HINDUNILVR.NS'])
  const indianData = useIndianStockPrices(indianSymbols)
  
  // US stocks
  const [usSymbols, setUsSymbols] = useState(['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA'])
  const [usPrices, setUsPrices] = useState({})
  const [usSeries, setUsSeries] = useState([])
  const [usLoading, setUsLoading] = useState(true)
  
  // Cryptocurrency
  const [cryptoSymbols, setCryptoSymbols] = useState(['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT'])
  const cryptoData = useCryptoPrices(cryptoSymbols)
  
  // Current active data based on market
  const getCurrentData = () => {
    if (activeMarket === 'indian') {
      return { prices: indianData.prices, series: indianData.series, loading: indianData.loading }
    } else if (activeMarket === 'us') {
      return { prices: usPrices, series: usSeries, loading: usLoading }
    } else {
      return { prices: cryptoData.prices, series: cryptoData.series, loading: false }
    }
  }
  
  const { prices, series, loading } = getCurrentData()
  
  // Get current symbols based on active market
  const getCurrentSymbols = () => {
    if (activeMarket === 'indian') return indianSymbols
    if (activeMarket === 'us') return usSymbols
    return cryptoSymbols
  }
  
  // Initialize watchlist from real-time data
  const [watchlist, setWatchlist] = useState([])
  const [selected, setSelected] = useState(null)
  const [order, setOrder] = useState({ type: 'Limit', side: 'Buy', qty: 1, price: '' })
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [positions, setPositions] = useState([])
  const [orders, setOrders] = useState([])
  const [balance, setBalance] = useState(50000)
  const [todayPnL, setTodayPnL] = useState(0)

  // Search for stocks
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

  // Add stock from search to watchlist
  const handleAddFromSearch = (stock) => {
    handleAddStock(stock.symbol)
    setSearch('')
    setSearchResults([])
    setShowSearchBar(false)
  }

  // Function to add stock to watchlist
  const handleAddStock = (symbol) => {
    if (activeMarket === 'indian' && !indianSymbols.includes(symbol)) {
      setIndianSymbols(prev => [...prev, symbol])
    } else if (activeMarket === 'us' && !usSymbols.includes(symbol)) {
      setUsSymbols(prev => [...prev, symbol])
    } else if (activeMarket === 'crypto' && !cryptoSymbols.includes(symbol)) {
      setCryptoSymbols(prev => [...prev, symbol])
    }
  }

  // Fetch US stocks prices
  const fetchUSStocks = async () => {
    if (usSymbols.length === 0) return
    
    try {
      setUsLoading(true)
      const symbolsQuery = usSymbols.join(',')
      const response = await fetch(`${API_URL}/stocks/us-stocks?symbols=${symbolsQuery}`)
      
      if (!response.ok) throw new Error('Failed to fetch US stocks')
      
      const data = await response.json()
      
      if (data.quoteResponse && data.quoteResponse.result) {
        const newPrices = {}
        
        data.quoteResponse.result.forEach(quote => {
          const price = quote.regularMarketPrice || quote.previousClose || 0
          const change = quote.regularMarketChangePercent || 0
          
          newPrices[quote.symbol] = {
            price: price.toFixed(2),
            change: change.toFixed(2),
            high: (quote.regularMarketDayHigh || price).toFixed(2),
            low: (quote.regularMarketDayLow || price).toFixed(2),
            open: (quote.regularMarketOpen || price).toFixed(2),
            previousClose: (quote.previousClose || price).toFixed(2),
            volume: quote.regularMarketVolume || 0,
            shortName: quote.shortName || quote.symbol
          }
        })
        
        setUsPrices(newPrices)
        
        // Update series for first symbol
        if (newPrices[usSymbols[0]]) {
          setUsSeries(prev => {
            const newPoint = {
              time: new Date().toLocaleTimeString(),
              price: parseFloat(newPrices[usSymbols[0]].price)
            }
            const updated = [...prev, newPoint]
            return updated.slice(-50)
          })
        }
      }
    } catch (error) {
      console.error('Error fetching US stocks:', error)
    } finally {
      setUsLoading(false)
    }
  }

  // Fetch US stocks on mount and every 5 seconds
  useEffect(() => {
    if (activeMarket === 'us') {
      fetchUSStocks()
      const interval = setInterval(fetchUSStocks, 5000)
      return () => clearInterval(interval)
    }
  }, [usSymbols.join(','), activeMarket])

  // Update watchlist when prices change
  useEffect(() => {
    if (Object.keys(prices).length > 0) {
      const currentSymbols = getCurrentSymbols()
      const newWatchlist = currentSymbols.map(symbol => ({
        symbol,
        name: prices[symbol]?.shortName || symbol.replace('.NS', '').replace('.BO', '').replace('USDT', ''),
        ltp: parseFloat(prices[symbol]?.price || 0),
        change: parseFloat(prices[symbol]?.change || 0)
      }))
      setWatchlist(newWatchlist)
      
      // Set selected if not already set or market changed
      if (!selected || !currentSymbols.includes(selected.symbol)) {
        if (newWatchlist.length > 0) {
          setSelected(newWatchlist[0])
        }
      }
    }
  }, [prices, activeMarket])

  // Update selected symbol price
  useEffect(() => {
    if (selected && prices[selected.symbol]) {
      setSelected(prev => ({
        ...prev,
        ltp: parseFloat(prices[selected.symbol].price),
        change: parseFloat(prices[selected.symbol].change || 0)
      }))
    }
  }, [prices, selected?.symbol])

  const placeOrder = ()=>{
    const unitPrice = order.type === 'Market' || !order.price ? (selected?.ltp || 0) : parseFloat(order.price)
    const qty = Number(order.qty) || 0
    const cost = +(unitPrice * qty).toFixed(2)
    if (!selected || !selected.symbol) { alert('Select a symbol first'); return }
    if (qty <= 0) { alert('Enter quantity'); return }
    if (isNaN(unitPrice) || unitPrice <= 0) { alert('Invalid price'); return }

    if (order.side === 'Buy') {
      if (balance < cost) { alert(`Insufficient funds. Required ₹${cost}, Available ₹${balance.toFixed(2)}`); return }
    }

    const newOrder = {
      id: Date.now(),
      symbol: selected.symbol,
      side: order.side,
      qty,
      price: order.type === 'Market' ? 'MKT' : unitPrice,
      status: 'Filled',
      time: new Date().toLocaleTimeString(),
    }
    setOrders(o=>[newOrder, ...o].slice(0,50))

    if (order.side === 'Buy') {
      setBalance(b => +((b - cost)).toFixed(2))
      setPositions(p=>{
        const existing = p.find(pos=>pos.symbol===selected.symbol && pos.side==='Buy')
        if (existing) {
          const prevCost = existing.avg * existing.qty
          const newQty = existing.qty + qty
          const newAvg = (prevCost + unitPrice * qty) / newQty
          existing.qty = newQty
          existing.avg = +newAvg.toFixed(2)
          return [...p]
        }
        return [{ symbol: selected.symbol, qty, avg: +unitPrice.toFixed(2), side: 'Buy' }, ...p]
      })
    } else {
      setBalance(b => +((b + cost)).toFixed(2))
      setPositions(p=>{
        const existing = p.find(pos=>pos.symbol===selected.symbol && pos.side==='Buy')
        if (existing) {
          existing.qty -= qty
          if (existing.qty <= 0) {
            return p.filter(x=>x!==existing)
          }
          return [...p]
        }
        const sellPos = p.find(pos=>pos.symbol===selected.symbol && pos.side==='Sell')
        if (sellPos) { sellPos.qty += qty; return [...p] }
        return [{ symbol: selected.symbol, qty, avg: +unitPrice.toFixed(2), side: 'Sell' }, ...p]
      })
    }

    setOrder({ type: order.type, side: order.side, qty: 1, price: '' })
  }

  // Calculate portfolio stats
  const portfolioValue = positions.reduce((sum, pos) => {
    const currentPrice = parseFloat(prices[pos.symbol]?.price || pos.avg)
    return sum + (currentPrice * pos.qty)
  }, 0)

  const totalValue = balance + portfolioValue

  useEffect(() => {
    // Calculate today's P&L based on positions
    const pnl = positions.reduce((sum, pos) => {
      const currentPrice = parseFloat(prices[pos.symbol]?.price || pos.avg)
      const costBasis = pos.avg * pos.qty
      return sum + ((currentPrice - pos.avg) * pos.qty)
    }, 0)
    setTodayPnL(pnl)
  }, [positions, prices])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar logged={isAuthenticated} setLogged={()=>{}} />
      
      <main className="flex-1 container mx-auto px-4 md:px-6 py-4 md:py-6">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 md:mb-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">Trading Dashboard</h1>
              <p className="text-sm md:text-base text-slate-600">Welcome back, {user?.name || 'Trader'}!</p>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSearchBar(!showSearchBar)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <Search size={18} />
                <span className="text-sm font-medium">Search</span>
              </motion.button>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-slate-400" />
                <span className="text-xs md:text-sm text-slate-500">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Market Tabs */}
          <div className="flex gap-2 mb-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveMarket('indian')}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                activeMarket === 'indian'
                  ? 'bg-gradient-to-r from-orange-500 to-green-500 text-white shadow-lg'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              🇮🇳 Indian Stocks
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveMarket('us')}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                activeMarket === 'us'
                  ? 'bg-gradient-to-r from-blue-600 to-red-600 text-white shadow-lg'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              🇺🇸 US Stocks
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveMarket('crypto')}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                activeMarket === 'crypto'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              ₿ Crypto
            </motion.button>
          </div>

          {/* Search Bar */}
          <AnimatePresence>
            {showSearchBar && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-white rounded-xl shadow-lg p-4 border border-indigo-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Search className="w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder={
                        activeMarket === 'indian' 
                          ? "Search Indian stocks (e.g., RELIANCE, TCS, INFY)..."
                          : activeMarket === 'us'
                          ? "Search US stocks (e.g., AAPL, TSLA, GOOGL)..."
                          : "Search crypto (e.g., BTCUSDT, ETHUSDT)..."
                      }
                      value={search}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      autoFocus
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setShowSearchBar(false)
                        setSearch('')
                        setSearchResults([])
                      }}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <X size={20} className="text-slate-600" />
                    </motion.button>
                  </div>

                  {searching && (
                    <div className="flex items-center justify-center py-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full"
                      />
                      <span className="ml-2 text-sm text-slate-600">Searching...</span>
                    </div>
                  )}

                  {!searching && searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-2 max-h-60 overflow-y-auto"
                    >
                      {searchResults.map((stock, index) => (
                        <motion.div
                          key={stock.symbol}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between p-3 bg-slate-50 hover:bg-indigo-50 rounded-lg cursor-pointer transition-all group"
                          onClick={() => handleAddFromSearch(stock)}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900">{stock.symbol}</span>
                              <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded">
                                {stock.exchange}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 truncate">{stock.name}</p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-indigo-600 text-white rounded-lg group-hover:bg-indigo-700 transition-colors"
                          >
                            <Plus size={16} />
                          </motion.button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {!searching && search.length >= 2 && searchResults.length === 0 && (
                    <div className="text-center py-6 text-slate-500 text-sm">
                      No stocks found for "{search}"
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 md:p-5 text-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <Wallet size={20} className="opacity-80" />
                <Activity size={16} className="opacity-60" />
              </div>
              <div className="text-xs md:text-sm opacity-90 mb-1">Total Balance</div>
              <div className="text-xl md:text-2xl font-bold">₹{totalValue.toFixed(2)}</div>
              <div className="text-xs opacity-75 mt-1">Cash: ₹{balance.toFixed(2)}</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 md:p-5 text-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <TrendingUp size={20} className="opacity-80" />
                <BarChart3 size={16} className="opacity-60" />
              </div>
              <div className="text-xs md:text-sm opacity-90 mb-1">Today's P&L</div>
              <div className="text-xl md:text-2xl font-bold">
                {todayPnL >= 0 ? '+' : ''}₹{todayPnL.toFixed(2)}
              </div>
              <div className="text-xs opacity-75 mt-1">
                {todayPnL >= 0 ? '↑' : '↓'} {((todayPnL / totalValue) * 100).toFixed(2)}%
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 md:p-5 text-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <BarChart3 size={20} className="opacity-80" />
                <TrendingUp size={16} className="opacity-60" />
              </div>
              <div className="text-xs md:text-sm opacity-90 mb-1">Open Positions</div>
              <div className="text-xl md:text-2xl font-bold">{positions.length}</div>
              <div className="text-xs opacity-75 mt-1">Portfolio: ₹{portfolioValue.toFixed(2)}</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 md:p-5 text-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <Activity size={20} className="opacity-80" />
                <div className={`w-2 h-2 rounded-full ${
                  !indianData.loading ? 'bg-green-300 animate-pulse' : 'bg-red-300'
                }`}></div>
              </div>
              <div className="text-xs md:text-sm opacity-90 mb-1">Total Orders</div>
              <div className="text-xl md:text-2xl font-bold">{orders.length}</div>
              <div className="text-xs opacity-75 mt-1">
                {!indianData.loading ? 'Live Market Data' : 'Connecting...'}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Trading Grid - Responsive Layout */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-4"
        >
          <Watchlist watchlist={watchlist} onSelect={setSelected} selected={selected} onAddStock={handleAddStock} />
          <ChartView series={series} selected={selected} />
          <OrderPanel order={order} setOrder={setOrder} placeOrder={placeOrder} balance={balance} />
          
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="col-span-1 lg:col-span-12 bg-white p-4 md:p-6 rounded-xl shadow-lg mt-2"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <PositionsTable positions={positions} />
              <OrdersTable orders={orders} />
            </div>
          </motion.section>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
