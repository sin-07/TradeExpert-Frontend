'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Wallet, 
  BarChart3, 
  Search, 
  Plus, 
  X, 
  PlusCircle, 
  Coins, 
  Sparkles 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Watchlist from '@/components/Trading/Watchlist';
import ChartView from '@/components/Trading/ChartView';
import OrderPanel from '@/components/Trading/OrderPanel';
import OrdersTable from '@/components/Trading/OrdersTable';
import PositionsTable from '@/components/Trading/PositionsTable';
import useIndianStockPrices from '@/hooks/useIndianStockPrices';
import useCryptoPrices from '@/hooks/useCryptoPrices';
import api from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Market tabs: 'indian', 'us', 'crypto'
  const [activeMarket, setActiveMarket] = useState('indian');

  // Indian stocks
  const [indianSymbols, setIndianSymbols] = useState([
    'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'ICICIBANK.NS', 'HINDUNILVR.NS', 'ITC.NS', 'SBIN.NS'
  ]);
  const indianData = useIndianStockPrices(indianSymbols);

  // US stocks
  const [usSymbols, setUsSymbols] = useState(['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'META']);
  const [usPrices, setUsPrices] = useState({});
  const [usSeries, setUsSeries] = useState([]);

  // Cryptocurrency
  const [cryptoSymbols, setCryptoSymbols] = useState(['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'DOGEUSDT']);
  const cryptoData = useCryptoPrices(cryptoSymbols);

  // Active data provider
  const getCurrentData = () => {
    if (activeMarket === 'indian') {
      return { prices: indianData.prices, series: indianData.series };
    } else if (activeMarket === 'us') {
      return { prices: usPrices, series: usSeries };
    } else {
      return { prices: cryptoData.prices, series: cryptoData.series };
    }
  };

  const { prices, series } = getCurrentData();

  // Watchlist & Trading State
  const [watchlist, setWatchlist] = useState([]);
  const [selected, setSelected] = useState(null);
  const [order, setOrder] = useState({ type: 'Market', side: 'Buy', qty: 1, price: '' });
  const [positions, setPositions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [balance, setBalance] = useState(50000);
  const [todayPnL, setTodayPnL] = useState(0);
  const [orderLoading, setOrderLoading] = useState(false);

  // GSAP Left-Right Animation Layout Refs
  const headerLeftRef = useRef(null);
  const headerRightRef = useRef(null);
  const metricsGridRef = useRef(null);
  const terminalGridRef = useRef(null);
  const bottomGridRef = useRef(null);

  // Trigger GSAP Left-Right Animations after mount
  useEffect(() => {
    if (headerLeftRef.current && headerRightRef.current) {
      gsap.fromTo(
        headerLeftRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }
      );
      gsap.fromTo(
        headerRightRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }
      );
    }

    if (metricsGridRef.current) {
      gsap.fromTo(
        metricsGridRef.current.children,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.15 }
      );
    }

    if (terminalGridRef.current && terminalGridRef.current.children.length >= 3) {
      const [watchlistEl, chartEl, orderEl] = terminalGridRef.current.children;
      gsap.fromTo(
        watchlistEl,
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, duration: 0.75, ease: 'power3.out', delay: 0.25 }
      );
      gsap.fromTo(
        chartEl,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.75, ease: 'power3.out', delay: 0.3 }
      );
      gsap.fromTo(
        orderEl,
        { opacity: 0, x: 60 },
        { opacity: 1, x: 0, duration: 0.75, ease: 'power3.out', delay: 0.35 }
      );
    }

    if (bottomGridRef.current && bottomGridRef.current.children.length >= 2) {
      const [posEl, ordEl] = bottomGridRef.current.children;
      gsap.fromTo(
        posEl,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', delay: 0.45 }
      );
      gsap.fromTo(
        ordEl,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', delay: 0.45 }
      );
    }
  }, []);

  // Fetch Portfolio & Positions
  const fetchPortfolio = useCallback(async () => {
    try {
      const data = await api.getPortfolio();
      if (data) {
        setBalance(data.balance ?? 50000);
        setPositions(
          data.positions?.map((pos) => ({
            symbol: pos.symbol,
            stockName: pos.stockName,
            qty: pos.quantity,
            avg: pos.averagePrice,
            side: pos.side,
            market: pos.market,
          })) || []
        );
      }
    } catch (error) {
      console.error('Portfolio error:', error);
    }
  }, []);

  // Fetch Order History
  const fetchOrders = useCallback(async () => {
    try {
      const data = await api.getTradingOrders(50, 1);
      if (data?.orders) {
        setOrders(
          data.orders.map((o) => ({
            id: o._id,
            symbol: o.symbol,
            side: o.side,
            qty: o.quantity,
            price: o.price,
            status: o.status,
            time: new Date(o.executedAt || o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }))
        );
      }
    } catch (error) {
      console.error('Orders error:', error);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPortfolio();
      fetchOrders();
    }
  }, [isAuthenticated, fetchPortfolio, fetchOrders]);

  // Fetch US Stocks polling
  const fetchUSStocks = useCallback(async () => {
    try {
      const symbolsQuery = usSymbols.join(',');
      const res = await fetch(`${API_URL}/stocks/us-stocks?symbols=${symbolsQuery}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.quoteResponse?.result) {
        const newPrices = {};
        data.quoteResponse.result.forEach((stock) => {
          newPrices[stock.symbol] = {
            price: stock.regularMarketPrice?.toFixed(2) || '0.00',
            change: stock.regularMarketChangePercent?.toFixed(2) || '0.00',
            high: stock.regularMarketDayHigh?.toFixed(2) || '0.00',
            low: stock.regularMarketDayLow?.toFixed(2) || '0.00',
            open: stock.regularMarketOpen?.toFixed(2) || '0.00',
            shortName: stock.shortName || stock.symbol,
          };
        });
        setUsPrices(newPrices);
      }
    } catch (e) {
      console.error('US stocks fetch failed:', e);
    }
  }, [usSymbols]);

  useEffect(() => {
    if (activeMarket === 'us') {
      fetchUSStocks();
      const interval = setInterval(fetchUSStocks, 5000);
      return () => clearInterval(interval);
    }
  }, [activeMarket, fetchUSStocks]);

  // Update Watchlist on market or price change
  useEffect(() => {
    const currentSymbols =
      activeMarket === 'indian' ? indianSymbols : activeMarket === 'us' ? usSymbols : cryptoSymbols;

    const list = currentSymbols.map((sym) => ({
      symbol: sym,
      name: prices[sym]?.shortName || sym,
      ltp: parseFloat(prices[sym]?.price || 0),
      change: parseFloat(prices[sym]?.change || 0),
    }));

    setWatchlist(list);

    if (!selected && list.length > 0) {
      setSelected(list[0]);
    } else if (selected) {
      const match = list.find((s) => s.symbol === selected.symbol);
      if (match) setSelected((prev) => ({ ...prev, ltp: match.ltp, change: match.change }));
    }
  }, [prices, activeMarket, indianSymbols, usSymbols, cryptoSymbols]); // eslint-disable-line react-hooks/exhaustive-deps

  // Calculate Portfolio Value & P&L
  const portfolioInvested = positions.reduce((acc, pos) => {
    const currentPrice = parseFloat(prices[pos.symbol]?.price || pos.avg || 0);
    return acc + currentPrice * pos.qty;
  }, 0);

  const totalValue = balance + portfolioInvested;

  useEffect(() => {
    const pnl = positions.reduce((acc, pos) => {
      const currentPrice = parseFloat(prices[pos.symbol]?.price || pos.avg || 0);
      const buyPrice = pos.avg || 0;
      return acc + (currentPrice - buyPrice) * pos.qty;
    }, 0);
    setTodayPnL(pnl);
  }, [prices, positions]);

  // Add stock to watchlist
  const handleAddStock = (stock) => {
    const sym = typeof stock === 'string' ? stock : stock.symbol;
    if (activeMarket === 'indian') {
      if (!indianSymbols.includes(sym)) setIndianSymbols((prev) => [...prev, sym]);
    } else if (activeMarket === 'us') {
      if (!usSymbols.includes(sym)) setUsSymbols((prev) => [...prev, sym]);
    } else {
      if (!cryptoSymbols.includes(sym)) setCryptoSymbols((prev) => [...prev, sym]);
    }
    toast.success(`Added ${sym} to watchlist`);
  };

  // Quick virtual deposit
  const handleDeposit = async () => {
    try {
      const res = await api.depositFunds(50000);
      setBalance(res.balance);
      toast.success('+₹50,000 Virtual Funds Deposited!', { icon: '💰' });
    } catch (err) {
      toast.error('Deposit failed');
    }
  };

  // Execute Order
  const handlePlaceOrder = async () => {
    if (!selected) {
      toast.error('Please select an asset from the watchlist');
      return;
    }

    const price = parseFloat(order.price) || parseFloat(selected.ltp) || 100;
    const qty = parseInt(order.qty, 10);

    if (isNaN(qty) || qty <= 0) {
      toast.error('Invalid quantity');
      return;
    }

    setOrderLoading(true);
    const toastId = toast.loading(`Executing ${order.side} order for ${selected.symbol}...`);

    try {
      const res = await api.placeOrder({
        symbol: selected.symbol,
        stockName: selected.name || selected.symbol,
        orderType: order.type,
        side: order.side,
        quantity: qty,
        price,
        market: activeMarket,
      });

      toast.success(res.message || 'Order filled successfully!', { id: toastId });
      setBalance(res.portfolio.balance);
      setPositions(
        res.portfolio.positions?.map((p) => ({
          symbol: p.symbol,
          stockName: p.stockName,
          qty: p.quantity,
          avg: p.averagePrice,
          side: p.side,
          market: p.market,
        })) || []
      );
      fetchOrders();
    } catch (err) {
      toast.error(err.message || 'Failed to execute order', { id: toastId });
    } finally {
      setOrderLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-cyan-400 animate-spin" />
        <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
          Initializing TradeXpert Terminal...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070b12] text-slate-100">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-5 space-y-5">
        {/* Market Category Selector & Summary Strip */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          {/* Segment Selector */}
          <div ref={headerLeftRef} className="flex items-center gap-1.5 p-1 bg-[#0b101b] rounded-2xl border border-white/10 w-fit">
            <button
              onClick={() => setActiveMarket('indian')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 ${
                activeMarket === 'indian'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              🇮🇳 NSE Equities (Top 50)
            </button>

            <button
              onClick={() => setActiveMarket('us')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 ${
                activeMarket === 'us'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              🇺🇸 US Tech (NASDAQ)
            </button>

            <button
              onClick={() => setActiveMarket('crypto')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 ${
                activeMarket === 'crypto'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              🪙 Binance Crypto
            </button>
          </div>

          {/* Quick Actions */}
          <div ref={headerRightRef} className="flex items-center gap-3">
            <button
              onClick={handleDeposit}
              className="flex items-center gap-2 px-3.5 py-2 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold rounded-xl transition-all shadow-sm"
            >
              <PlusCircle size={15} />
              <span>+ Deposit Virtual ₹50,000</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div ref={metricsGridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#0b101b] border border-white/10 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
            <div className="flex justify-between items-center text-slate-400 text-xs font-medium mb-1">
              <span>Total Portfolio</span>
              <Wallet size={16} className="text-cyan-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-white">
              ₹{totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-1">
              Cash: ₹{balance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0b101b] border border-white/10 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />
            <div className="flex justify-between items-center text-slate-400 text-xs font-medium mb-1">
              <span>Unrealized P&amp;L</span>
              <TrendingUp size={16} className={todayPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'} />
            </div>
            <div
              className={`text-xl sm:text-2xl font-black font-mono ${
                todayPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {todayPnL >= 0 ? '+' : ''}₹{todayPnL.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-1">
              Return: {totalValue > 0 ? ((todayPnL / totalValue) * 100).toFixed(2) : '0.00'}%
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0b101b] border border-white/10 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl" />
            <div className="flex justify-between items-center text-slate-400 text-xs font-medium mb-1">
              <span>Active Positions</span>
              <BarChart3 size={16} className="text-purple-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-white">
              {positions.length} <span className="text-xs font-normal text-slate-400">Assets</span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-1">
              Holdings: ₹{portfolioInvested.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0b101b] border border-white/10 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl" />
            <div className="flex justify-between items-center text-slate-400 text-xs font-medium mb-1">
              <span>Orders Filled</span>
              <Activity size={16} className="text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-white">
              {orders.length} <span className="text-xs font-normal text-slate-400">Trades</span>
            </div>
            <p className="text-[11px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Engine Online
            </p>
          </div>
        </div>

        {/* Core Trading Terminal (Watchlist, ChartView, OrderPanel) */}
        <div ref={terminalGridRef} className="grid grid-cols-12 gap-4">
          <Watchlist
            watchlist={watchlist}
            onSelect={setSelected}
            selected={selected}
            onAddStock={handleAddStock}
          />

          <ChartView series={series} selected={selected} />

          <OrderPanel
            order={order}
            setOrder={setOrder}
            placeOrder={handlePlaceOrder}
            balance={balance}
            loading={orderLoading}
            selectedStockPrice={selected?.ltp || 0}
            onQuickDeposit={handleDeposit}
          />
        </div>

        {/* Lower Terminal: Positions and Orders History */}
        <div ref={bottomGridRef} className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
          <PositionsTable
            positions={positions}
            currentPrices={prices}
            onPositionClosed={() => {
              fetchPortfolio();
              fetchOrders();
            }}
          />

          <OrdersTable orders={orders} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
