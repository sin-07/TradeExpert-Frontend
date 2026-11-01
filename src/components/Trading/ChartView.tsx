'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  CandlestickChart, 
  Activity, 
  BarChart2, 
  LineChart, 
  Layers, 
  Calendar,
  Maximize2
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export default function ChartView({ series = [], selected }) {
  const chartRef = useRef(null);
  const containerRef = useRef(null);
  const [chartType, setChartType] = useState('area'); // 'line', 'area', 'candlestick'
  const [historicalData, setHistoricalData] = useState([]);
  const [timeframe, setTimeframe] = useState('1D'); // 1D, 1W, 1M, 3M, 1Y
  const [loading, setLoading] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Fetch historical data when selected stock changes
  useEffect(() => {
    if (!selected?.symbol) return;

    let isMounted = true;
    const fetchHistoricalData = async () => {
      setLoading(true);
      try {
        const rangeMap = { '1D': '1d', '1W': '5d', '1M': '1mo', '3M': '3mo', '1Y': '1y' };
        const intervalMap = { '1D': '5m', '1W': '30m', '1M': '1d', '3M': '1d', '1Y': '1wk' };

        const range = rangeMap[timeframe] || '1d';
        const interval = intervalMap[timeframe] || '5m';

        const response = await fetch(
          `${API_URL}/stocks/historical?symbol=${encodeURIComponent(selected.symbol)}&interval=${interval}&range=${range}`
        );

        if (!response.ok) throw new Error('Historical fetch failed');
        const data = await response.json();

        if (isMounted && data.chart?.result?.[0]) {
          const result = data.chart.result[0];
          const timestamps = result.timestamp || [];
          const quotes = result.indicators?.quote?.[0] || {};

          const historical = timestamps
            .map((timestamp, i) => ({
              time: new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              open: quotes.open?.[i] || quotes.close?.[i] || 0,
              high: quotes.high?.[i] || quotes.close?.[i] || 0,
              low: quotes.low?.[i] || quotes.close?.[i] || 0,
              close: quotes.close?.[i] || 0,
              volume: quotes.volume?.[i] || 0,
            }))
            .filter((d) => d.close > 0);

          setHistoricalData(historical);
        }
      } catch (error) {
        if (isMounted) setHistoricalData([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHistoricalData();
    return () => { isMounted = false; };
  }, [selected?.symbol, timeframe]);

  // Combine historical or real-time series
  const chartData = historicalData.length > 0
    ? historicalData
    : (series && series.length > 0
      ? series.map((s, idx) => ({
          time: s.time || `${idx}`,
          open: s.price,
          high: s.price * 1.002,
          low: s.price * 0.998,
          close: s.price,
          volume: 1000,
        }))
      : Array.from({ length: 30 }).map((_, i) => {
          const base = selected?.ltp || 1000;
          const delta = Math.sin(i / 3) * (base * 0.02);
          const p = +(base + delta).toFixed(2);
          return { time: `${i}:00`, open: p, high: p * 1.003, low: p * 0.997, close: p, volume: 500 };
        }));

  // Render on HTML5 Canvas
  useEffect(() => {
    if (!chartRef.current || chartData.length === 0) return;
    const canvas = chartRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement?.clientWidth || 700;
    const height = 340;

    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.clearRect(0, 0, width, height);

    const padding = { top: 25, right: 65, bottom: 35, left: 20 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const allPrices = chartType === 'candlestick'
      ? chartData.flatMap(d => [d.high, d.low])
      : chartData.map(d => d.close);

    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    const priceRange = maxPrice - minPrice || 1;

    // Draw Dark Gridlines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    const yGridCount = 5;
    for (let i = 0; i <= yGridCount; i++) {
      const y = padding.top + (chartHeight / yGridCount) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      const priceVal = maxPrice - (priceRange / yGridCount) * i;
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      ctx.setLineDash([]);
      ctx.fillText(`₹${priceVal.toFixed(2)}`, width - padding.right + 8, y + 3);
      ctx.setLineDash([4, 4]);
    }
    ctx.setLineDash([]);

    // Draw Chart based on type
    if (chartType === 'area' || chartType === 'line') {
      const isBullish = (selected?.change ?? 0) >= 0;
      const strokeColor = isBullish ? '#10b981' : '#f43f5e';
      const gradientStart = isBullish ? 'rgba(16, 185, 129, 0.35)' : 'rgba(244, 63, 94, 0.35)';

      // Gradient Fill
      if (chartType === 'area') {
        const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
        gradient.addColorStop(0, gradientStart);
        gradient.addColorStop(1, 'rgba(15, 23, 42, 0)');

        ctx.beginPath();
        ctx.moveTo(padding.left, height - padding.bottom);

        chartData.forEach((point, idx) => {
          const x = padding.left + (idx / (chartData.length - 1 || 1)) * chartWidth;
          const y = padding.top + chartHeight - ((point.close - minPrice) / priceRange) * chartHeight;
          if (idx === 0) ctx.lineTo(x, y);
          else ctx.lineTo(x, y);
        });

        ctx.lineTo(width - padding.right, height - padding.bottom);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Line Stroke
      ctx.beginPath();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      chartData.forEach((point, idx) => {
        const x = padding.left + (idx / (chartData.length - 1 || 1)) * chartWidth;
        const y = padding.top + chartHeight - ((point.close - minPrice) / priceRange) * chartHeight;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.stroke();

      // Glowing dot at the latest price
      const lastPoint = chartData[chartData.length - 1];
      const lastX = width - padding.right;
      const lastY = padding.top + chartHeight - ((lastPoint.close - minPrice) / priceRange) * chartHeight;

      ctx.beginPath();
      ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
      ctx.fillStyle = strokeColor;
      ctx.shadowColor = strokeColor;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    } else {
      // Candlestick Chart
      const candleCount = chartData.length;
      const candleWidth = Math.max(3, (chartWidth / candleCount) * 0.7);

      chartData.forEach((candle, idx) => {
        const xCenter = padding.left + (idx / (candleCount - 1 || 1)) * chartWidth;
        const isUp = candle.close >= candle.open;
        const color = isUp ? '#10b981' : '#f43f5e';

        const yHigh = padding.top + chartHeight - ((candle.high - minPrice) / priceRange) * chartHeight;
        const yLow = padding.top + chartHeight - ((candle.low - minPrice) / priceRange) * chartHeight;
        const yOpen = padding.top + chartHeight - ((candle.open - minPrice) / priceRange) * chartHeight;
        const yClose = padding.top + chartHeight - ((candle.close - minPrice) / priceRange) * chartHeight;

        // Wick
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.moveTo(xCenter, yHigh);
        ctx.lineTo(xCenter, yLow);
        ctx.stroke();

        // Body
        const topY = Math.min(yOpen, yClose);
        const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));

        ctx.fillStyle = color;
        ctx.fillRect(xCenter - candleWidth / 2, topY, candleWidth, bodyHeight);
      });
    }
  }, [chartData, chartType, selected]);

  const currentPrice = selected?.ltp || chartData[chartData.length - 1]?.close || 0;
  const changePercent = selected?.change || 0;
  const isUp = changePercent >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      ref={containerRef}
      className="col-span-12 lg:col-span-7 bg-[#0b101b] rounded-2xl border border-white/10 shadow-2xl p-5 flex flex-col justify-between"
    >
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5 gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              {selected?.name || selected?.symbol || 'NIFTY 50'}
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-white/5 border border-white/10 text-cyan-400">
              {selected?.symbol || 'INDEX'}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Real-time
            </span>
          </div>

          <div className="flex items-baseline gap-3 mt-1.5">
            <span className="text-3xl font-black font-mono text-white tracking-tight">
              ₹{Number(currentPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span
              className={`px-2 py-0.5 rounded-md text-xs font-bold font-mono flex items-center gap-1 ${
                isUp
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              }`}
            >
              {isUp ? '+' : ''}{Number(changePercent).toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Toolbar: Chart Types & Timeframes */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Chart Type Switches */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-white/10">
            <button
              onClick={() => setChartType('area')}
              title="Area Chart"
              className={`p-1.5 rounded-lg text-xs transition-all ${
                chartType === 'area' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity size={15} />
            </button>
            <button
              onClick={() => setChartType('line')}
              title="Line Chart"
              className={`p-1.5 rounded-lg text-xs transition-all ${
                chartType === 'line' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LineChart size={15} />
            </button>
            <button
              onClick={() => setChartType('candlestick')}
              title="Candlestick Chart"
              className={`p-1.5 rounded-lg text-xs transition-all ${
                chartType === 'candlestick' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CandlestickChart size={15} />
            </button>
          </div>

          {/* Timeframe Buttons */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-white/10 text-xs">
            {['1D', '1W', '1M', '3M', '1Y'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded-lg font-mono font-medium transition-all ${
                  timeframe === tf
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative my-3 w-full h-[340px] flex items-center justify-center">
        {loading && (
          <div className="absolute inset-0 z-10 bg-[#0b101b]/60 backdrop-blur-[2px] flex items-center justify-center">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              Loading chart feed...
            </div>
          </div>
        )}
        <canvas ref={chartRef} className="w-full h-full block cursor-crosshair" />
      </div>

      {/* Chart Footer Indicator */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-slate-500">
        <div className="flex items-center gap-4 font-mono">
          <span>O: <strong className="text-slate-300">₹{(selected?.open || currentPrice).toFixed(2)}</strong></span>
          <span>H: <strong className="text-emerald-400">₹{(selected?.high || currentPrice * 1.01).toFixed(2)}</strong></span>
          <span>L: <strong className="text-rose-400">₹{(selected?.low || currentPrice * 0.99).toFixed(2)}</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          Live Tick Feed
        </div>
      </div>
    </motion.div>
  );
}
