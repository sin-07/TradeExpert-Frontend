import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrendingUp, Shield, Zap, BarChart3, Users, CheckCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import useIndianStockPrices from '../hooks/useIndianStockPrices'

export default function Home(){
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Nifty 50 top stocks
  const [nifty50Stocks] = useState([
    'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'ICICIBANK.NS',
    'HINDUNILVR.NS', 'ITC.NS', 'SBIN.NS', 'BHARTIARTL.NS', 'KOTAKBANK.NS',
    'LT.NS', 'AXISBANK.NS', 'ASIANPAINT.NS', 'MARUTI.NS', 'HCLTECH.NS',
    'BAJFINANCE.NS', 'WIPRO.NS', 'ULTRACEMCO.NS', 'TITAN.NS', 'SUNPHARMA.NS',
    'NESTLEIND.NS', 'TECHM.NS', 'ONGC.NS', 'NTPC.NS', 'POWERGRID.NS',
    'M&M.NS', 'TATAMOTORS.NS', 'BAJAJFINSV.NS', 'TATASTEEL.NS', 'ADANIPORTS.NS',
    'INDUSINDBK.NS', 'COALINDIA.NS', 'DRREDDY.NS', 'JSWSTEEL.NS', 'GRASIM.NS',
    'DIVISLAB.NS', 'CIPLA.NS', 'BRITANNIA.NS', 'EICHERMOT.NS', 'HINDALCO.NS',
    'APOLLOHOSP.NS', 'HEROMOTOCO.NS', 'SHREECEM.NS', 'UPL.NS', 'ADANIENT.NS',
    'BPCL.NS', 'TATACONSUM.NS', 'BAJAJ-AUTO.NS', 'HDFCLIFE.NS', 'SBILIFE.NS'
  ])

  // Fetch real-time prices for Nifty 50
  const { prices, loading } = useIndianStockPrices(nifty50Stocks)

  // Convert prices to stock list with changes
  const [stockList, setStockList] = useState([])

  useEffect(() => {
    if (Object.keys(prices).length > 0) {
      const stocks = nifty50Stocks.map(symbol => ({
        symbol,
        name: prices[symbol]?.shortName || symbol.replace('.NS', ''),
        ltp: parseFloat(prices[symbol]?.price || 0),
        change: parseFloat(prices[symbol]?.change || 0)
      })).filter(stock => stock.ltp > 0) // Only show stocks with valid prices
      setStockList(stocks)
    }
  }, [prices])

  const features = [
    { icon: TrendingUp, title: 'Live Market Data', desc: 'Real-time price updates and market insights' },
    { icon: Zap, title: 'Lightning Fast', desc: 'Execute trades in milliseconds' },
    { icon: Shield, title: 'Secure Trading', desc: 'Bank-grade security for your trades' },
    { icon: BarChart3, title: 'Advanced Charts', desc: 'Professional charting tools' },
    { icon: Users, title: 'Community', desc: 'Join thousands of active traders' },
    { icon: CheckCircle, title: 'Easy to Use', desc: 'Intuitive interface for all levels' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <Navbar logged={isAuthenticated} setLogged={()=>{}} />
      
      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="space-y-6"
            >
              <motion.div variants={itemVariants} className="inline-block">
                <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                  ✨ New: Advanced Trading Tools
                </span>
              </motion.div>
              
              <motion.h1 
                variants={itemVariants}
                className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight"
              >
                Trade Smarter with{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  TradeXpert
                </span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-xl text-slate-600 leading-relaxed"
              >
                Experience professional trading with live prices, instant order execution, 
                and a clean, intuitive interface designed for modern traders.
              </motion.p>
              
              <motion.div 
                variants={itemVariants}
                className="flex flex-wrap gap-4 pt-4"
              >
                <Link 
                  to='/signup' 
                  className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium"
                >
                  Get Started Free
                  <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link 
                  to='/login' 
                  className="px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-indigo-600 hover:text-indigo-600 transition-all duration-300 font-medium"
                >
                  Sign In
                </Link>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="flex items-center gap-6 pt-6 text-sm text-slate-600"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Free demo account</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Features Card */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-3xl opacity-20"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-slate-900">Why TradeXpert?</h3>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    LIVE
                  </span>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-indigo-600" />
                    <span>Real-time market data</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-indigo-600" />
                    <span>Advanced charting tools</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-indigo-600" />
                    <span>Instant order execution</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-indigo-600" />
                    <span>Portfolio tracking</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Nifty 50 Live Market Data Section */}
        <section className="bg-gradient-to-br from-slate-50 to-indigo-50 py-16">
          <div className="container mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md mb-4">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-semibold text-slate-700">LIVE MARKET DATA</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Nifty 50 Stocks
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Real-time prices from India's top 50 companies
              </p>
            </motion.div>

            {loading && stockList.length === 0 ? (
              <div className="text-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="inline-block w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"
                />
                <p className="mt-4 text-slate-600">Loading market data...</p>
              </div>
            ) : (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-slate-200 hover:scrollbar-thumb-indigo-600"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#818cf8 #e2e8f0'
                }}
              >
                {stockList.map((stock, index) => (
                  <motion.div
                    key={stock.symbol}
                    variants={itemVariants}
                    whileHover={{ scale: 1.03, y: -4 }}
                    className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 text-sm truncate">
                          {stock.symbol.replace('.NS', '')}
                        </h3>
                        <p className="text-xs text-slate-500 truncate">{stock.name}</p>
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                        stock.change >= 0 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {stock.change >= 0 ? (
                          <ArrowUpRight size={14} />
                        ) : (
                          <ArrowDownRight size={14} />
                        )}
                        <span className="text-xs font-semibold">
                          {Math.abs(stock.change).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">LTP</p>
                        <p className="text-xl font-bold text-slate-900">
                          ₹{stock.ltp.toFixed(2)}
                        </p>
                      </div>
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 2,
                          ease: 'easeInOut'
                        }}
                        className={`w-2 h-2 rounded-full ${
                          stock.change >= 0 ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {stockList.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="text-center mt-8"
              >
                <Link
                  to={isAuthenticated ? '/dashboard' : '/signup'}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium"
                >
                  <BarChart3 size={20} />
                  {isAuthenticated ? 'Go to Dashboard' : 'Start Trading Now'}
                  <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </motion.div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Everything you need to trade
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Professional trading tools designed for speed, security, and simplicity
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="p-6 bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
