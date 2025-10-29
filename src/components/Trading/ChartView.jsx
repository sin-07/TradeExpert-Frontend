import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, CandlestickChart, ZoomIn, ZoomOut, BarChart3, Activity, BarChart2 } from 'lucide-react'

// Get API URL from environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function ChartView({ series, selected }) {
  const chartRef = useRef(null)
  const [chartType, setChartType] = useState('line')
  const [candleGroupSize, setCandleGroupSize] = useState(4)
  const [showPatterns, setShowPatterns] = useState(true)
  const [candleWidth, setCandleWidth] = useState(1)
  const [historicalData, setHistoricalData] = useState([])
  const [timeframe, setTimeframe] = useState('1D') // 1D, 1W, 1M, 3M, 1Y
  const [loading, setLoading] = useState(false)

  // Fetch historical data when selected stock changes
  useEffect(() => {
    if (!selected?.symbol) return
    
    const fetchHistoricalData = async () => {
      setLoading(true)
      try {
        // Determine the range based on timeframe
        const rangeMap = {
          '1D': '1d',
          '1W': '5d',
          '1M': '1mo',
          '3M': '3mo',
          '1Y': '1y'
        }
        
        const intervalMap = {
          '1D': '5m',
          '1W': '30m',
          '1M': '1d',
          '3M': '1d',
          '1Y': '1wk'
        }
        
        const range = rangeMap[timeframe]
        const interval = intervalMap[timeframe]
        
        // Use backend proxy to avoid CORS issues
        const response = await fetch(
          `${API_URL}/stocks/historical?symbol=${selected.symbol}&interval=${interval}&range=${range}`
        )
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (data.chart?.result?.[0]) {
          const result = data.chart.result[0]
          const timestamps = result.timestamp || []
          const quotes = result.indicators?.quote?.[0] || {}
          
          const historical = timestamps.map((timestamp, i) => ({
            time: new Date(timestamp * 1000).toLocaleString(),
            open: quotes.open?.[i] || 0,
            high: quotes.high?.[i] || 0,
            low: quotes.low?.[i] || 0,
            close: quotes.close?.[i] || 0,
            volume: quotes.volume?.[i] || 0
          })).filter(d => d.close > 0)
          
          setHistoricalData(historical)
        }
      } catch (error) {
        console.error('Error fetching historical data:', error)
        // Fallback to real-time series data
        setHistoricalData([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchHistoricalData()
  }, [selected?.symbol, timeframe])

  // Use historical data if available, otherwise use real-time series
  const chartData = historicalData.length > 0 
    ? historicalData 
    : series.map(s => ({ 
        time: s.time, 
        open: s.price, 
        high: s.price, 
        low: s.price, 
        close: s.price 
      }))

  useEffect(() => {
    if (!chartRef.current || chartData.length === 0) return
    const canvas = chartRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth
    canvas.height = 350
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    if (chartType === 'line') {
      // Draw line chart using close prices
      const prices = chartData.map(d => d.close)
      const max = Math.max(...prices)
      const min = Math.min(...prices)
      const range = max - min || 1
      
      // Draw grid
      const padding = 40
      const chartHeight = canvas.height - padding * 2
      const chartWidth = canvas.width - padding * 2
      
      ctx.strokeStyle = '#f0f0f0'
      ctx.lineWidth = 1
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i
        ctx.beginPath()
        ctx.moveTo(padding, y)
        ctx.lineTo(canvas.width - padding, y)
        ctx.stroke()
        
        const price = max - (range / 5) * i
        ctx.fillStyle = '#94a3b8'
        ctx.font = '11px Arial'
        ctx.textAlign = 'right'
        ctx.fillText('₹' + price.toFixed(2), padding - 5, y + 4)
      }
      
      // Draw line
      ctx.strokeStyle = '#2563eb'
      ctx.lineWidth = 2
      ctx.beginPath()
      
      chartData.forEach((point, index) => {
        const x = padding + (index / (chartData.length - 1 || 1)) * chartWidth
        const y = padding + chartHeight - ((point.close - min) / range) * chartHeight
        if (index === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      
      ctx.stroke()
      
      // Fill area under line
      ctx.lineTo(canvas.width - padding, canvas.height - padding)
      ctx.lineTo(padding, canvas.height - padding)
      ctx.closePath()
      ctx.fillStyle = 'rgba(37, 99, 235, 0.1)'
      ctx.fill()
      
    } else if (chartType === 'area') {
      // Area chart
      const prices = chartData.map(d => d.close)
      const max = Math.max(...prices)
      const min = Math.min(...prices)
      const range = max - min || 1
      
      const padding = 40
      const chartHeight = canvas.height - padding * 2
      const chartWidth = canvas.width - padding * 2
      
      // Draw grid
      ctx.strokeStyle = '#f0f0f0'
      ctx.lineWidth = 1
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i
        ctx.beginPath()
        ctx.moveTo(padding, y)
        ctx.lineTo(canvas.width - padding, y)
        ctx.stroke()
        
        const price = max - (range / 5) * i
        ctx.fillStyle = '#94a3b8'
        ctx.font = '11px Arial'
        ctx.textAlign = 'right'
        ctx.fillText('₹' + price.toFixed(2), padding - 5, y + 4)
      }
      
      // Create gradient
      const gradient = ctx.createLinearGradient(0, padding, 0, canvas.height - padding)
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.6)')
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0.05)')
      
      ctx.beginPath()
      ctx.moveTo(padding, canvas.height - padding)
      
      chartData.forEach((point, index) => {
        const x = padding + (index / (chartData.length - 1 || 1)) * chartWidth
        const y = padding + chartHeight - ((point.close - min) / range) * chartHeight
        if (index === 0) ctx.lineTo(x, y)
        else ctx.lineTo(x, y)
      })
      
      ctx.lineTo(canvas.width - padding, canvas.height - padding)
      ctx.closePath()
      ctx.fillStyle = gradient
      ctx.fill()
      
      // Draw line on top
      ctx.strokeStyle = '#10b981'
      ctx.lineWidth = 2
      ctx.beginPath()
      chartData.forEach((point, index) => {
        const x = padding + (index / (chartData.length - 1 || 1)) * chartWidth
        const y = padding + chartHeight - ((point.close - min) / range) * chartHeight
        if (index === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()
      
    } else if (chartType === 'bar') {
      // Bar chart (volume)
      const volumes = chartData.map(d => d.volume || 1)
      const maxVolume = Math.max(...volumes)
      
      const padding = 40
      const chartHeight = canvas.height - padding * 2
      const chartWidth = canvas.width - padding * 2
      const barWidth = chartWidth / chartData.length * 0.8
      
      // Draw grid
      ctx.strokeStyle = '#f0f0f0'
      ctx.lineWidth = 1
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i
        ctx.beginPath()
        ctx.moveTo(padding, y)
        ctx.lineTo(canvas.width - padding, y)
        ctx.stroke()
      }
      
      chartData.forEach((point, index) => {
        const x = padding + (index / chartData.length) * chartWidth
        const barHeight = (point.volume / maxVolume) * chartHeight
        const y = canvas.height - padding - barHeight
        
        const isUp = point.close >= point.open
        ctx.fillStyle = isUp ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.6)'
        ctx.fillRect(x, y, barWidth, barHeight)
      })
      
    } else if (chartType === 'candlestick') {
      // Draw candlestick chart with grid and proper spacing
      const candleData = chartData
      
      if (candleData.length === 0) return
      
      const allPrices = candleData.flatMap(c => [c.high, c.low])
      const max = Math.max(...allPrices)
      const min = Math.min(...allPrices)
      const range = max - min || 1
      
      // Add padding
      const padding = 40
      const chartHeight = canvas.height - padding * 2
      const chartWidth = canvas.width - padding * 2
      
      // Draw grid lines
      ctx.strokeStyle = '#f0f0f0'
      ctx.lineWidth = 1
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i
        ctx.beginPath()
        ctx.moveTo(padding, y)
        ctx.lineTo(canvas.width - padding, y)
        ctx.stroke()
        
        // Price labels
        const price = max - (range / 5) * i
        ctx.fillStyle = '#94a3b8'
        ctx.font = '11px Arial'
        ctx.textAlign = 'right'
        ctx.fillText('₹' + price.toFixed(2), padding - 5, y + 4)
      }
      
      // Calculate candle spacing
      const totalCandles = candleData.length
      const candleSpacing = chartWidth / totalCandles
      const actualCandleWidth = Math.max(2, Math.min(candleSpacing * 0.7 * candleWidth, 50))
      
      // Draw candlesticks
      candleData.forEach((candle, index) => {
        const x = padding + (index + 0.5) * candleSpacing
        
        // Calculate Y positions
        const openY = padding + chartHeight - ((candle.open - min) / range) * chartHeight
        const closeY = padding + chartHeight - ((candle.close - min) / range) * chartHeight
        const highY = padding + chartHeight - ((candle.high - min) / range) * chartHeight
        const lowY = padding + chartHeight - ((candle.low - min) / range) * chartHeight
        
        const isUp = candle.close >= candle.open
        const color = isUp ? '#10b981' : '#ef4444'
        
        // Draw wick (thin line from high to low)
        ctx.strokeStyle = color
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x, highY)
        ctx.lineTo(x, lowY)
        ctx.stroke()
        
        // Draw body (rectangle from open to close)
        ctx.fillStyle = color
        const bodyHeight = Math.abs(closeY - openY) || 2
        const bodyY = Math.min(openY, closeY)
        
        if (isUp) {
          // Hollow (white fill with border) for up candles
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(x - actualCandleWidth / 2, bodyY, actualCandleWidth, bodyHeight)
          ctx.strokeStyle = color
          ctx.lineWidth = 2
          ctx.strokeRect(x - actualCandleWidth / 2, bodyY, actualCandleWidth, bodyHeight)
        } else {
          // Solid fill for down candles
          ctx.fillStyle = color
          ctx.fillRect(x - actualCandleWidth / 2, bodyY, actualCandleWidth, bodyHeight)
        }
        
        // Detect and draw hammer pattern
        if (showPatterns) {
          const body = Math.abs(candle.close - candle.open)
          const lowerWick = Math.min(candle.open, candle.close) - candle.low
          const upperWick = candle.high - Math.max(candle.open, candle.close)
          
          if (body > 0 && lowerWick >= body * 2 && upperWick <= body * 0.3) {
            ctx.fillStyle = '#10b981'
            ctx.font = 'bold 18px Arial'
            ctx.textAlign = 'center'
            ctx.fillText('↑', x, lowY + 25)
          }
        }
      })
      
      // Draw bottom labels (candle numbers)
      ctx.fillStyle = '#94a3b8'
      ctx.font = '10px Arial'
      ctx.textAlign = 'center'
      for (let i = 0; i < totalCandles; i += Math.max(1, Math.floor(totalCandles / 10))) {
        const x = padding + (i + 0.5) * candleSpacing
        ctx.fillText(i + 1, x, canvas.height - padding + 15)
      }
    }
  }, [chartData, chartType, candleGroupSize, showPatterns, candleWidth])

  return (
    <section className="col-span-1 lg:col-span-6 bg-white p-4 md:p-6 rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" />
            <h3 className="text-lg md:text-xl font-bold text-slate-800">{selected?.symbol}</h3>
          </div>
          <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-slate-600">
            <span>LTP: <span className="font-semibold text-slate-900">₹{(selected?.ltp || 0).toFixed(2)}</span></span>
            <motion.span 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`font-semibold px-2 py-1 rounded-lg ${selected?.change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            >
              {selected?.change >= 0 ? '↑' : '↓'} {(selected?.change || 0).toFixed(2)}%
            </motion.span>
          </div>
        </div>
        
        {/* Chart Type Toggle */}
        <div className="flex flex-wrap gap-1 md:gap-2 bg-slate-100 p-1 rounded-lg shadow-sm w-full md:w-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChartType('line')}
            className={`flex-1 md:flex-none px-2 md:px-3 py-1.5 md:py-2 rounded-lg flex items-center justify-center gap-1 md:gap-2 transition-all text-xs md:text-sm ${
              chartType === 'line'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp size={14} />
            <span className="font-medium">Line</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChartType('area')}
            className={`flex-1 md:flex-none px-2 md:px-3 py-1.5 md:py-2 rounded-lg flex items-center justify-center gap-1 md:gap-2 transition-all text-xs md:text-sm ${
              chartType === 'area'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity size={14} />
            <span className="font-medium">Area</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChartType('candlestick')}
            className={`flex-1 md:flex-none px-2 md:px-3 py-1.5 md:py-2 rounded-lg flex items-center justify-center gap-1 md:gap-2 transition-all text-xs md:text-sm ${
              chartType === 'candlestick'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CandlestickChart size={14} />
            <span className="font-medium">Candles</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChartType('bar')}
            className={`flex-1 md:flex-none px-2 md:px-3 py-1.5 md:py-2 rounded-lg flex items-center justify-center gap-1 md:gap-2 transition-all text-xs md:text-sm ${
              chartType === 'bar'
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart2 size={14} />
            <span className="font-medium">Volume</span>
          </motion.button>
        </div>
      </div>

      {/* Timeframe Selector */}
      {historicalData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-gradient-to-r from-indigo-50 to-blue-50 p-3 rounded-lg border border-indigo-100"
        >
          <span className="text-xs md:text-sm font-medium text-slate-700">Timeframe:</span>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {['1D', '1W', '1M', '3M', '1Y'].map((tf) => (
              <motion.button
                key={tf}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg text-xs md:text-sm font-medium transition-all ${
                  timeframe === tf
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tf}
              </motion.button>
            ))}
          </div>
          {loading && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="ml-auto w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full"
            />
          )}
        </motion.div>
      )}

      {/* Candlestick Controls */}
      {chartType === 'candlestick' && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-6 text-xs md:text-sm bg-slate-50 p-3 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <label className="text-slate-600">Timeframe:</label>
            <select
              value={candleGroupSize}
              onChange={(e) => setCandleGroupSize(Number(e.target.value))}
              className="px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={2}>2 points</option>
              <option value={4}>4 points</option>
              <option value={6}>6 points</option>
              <option value={8}>8 points</option>
              <option value={10}>10 points</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-slate-600">Width:</label>
            <button
              onClick={() => setCandleWidth(Math.max(0.5, candleWidth - 0.25))}
              className="p-1 hover:bg-slate-100 rounded"
              title="Decrease width"
            >
              <ZoomOut size={16} />
            </button>
            <span className="w-8 text-center">{candleWidth.toFixed(2)}</span>
            <button
              onClick={() => setCandleWidth(Math.min(2, candleWidth + 0.25))}
              className="p-1 hover:bg-slate-100 rounded"
              title="Increase width"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showPatterns}
                onChange={(e) => setShowPatterns(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-slate-600">Show Patterns</span>
            </label>
          </div>
        </motion.div>
      )}

      <canvas ref={chartRef} className="w-full rounded-lg" />
    </section>
  )
}
