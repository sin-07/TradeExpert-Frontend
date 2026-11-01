import { useEffect, useState, useRef } from 'react'

/**
 * Real-time Cryptocurrency Prices using Binance WebSocket
 * 
 * FREE & NO API KEY REQUIRED!
 * - Real-time updates via WebSocket
 * - Supports all Binance trading pairs
 * - Format: BTCUSDT, ETHUSDT, etc.
 * 
 * Add your own symbols in Dashboard.jsx
 */

// Real-time Crypto prices using Binance WebSocket (FREE, no API key needed)
export default function useCryptoPrices(symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT']) {
  const [prices, setPrices] = useState({})
  const [series, setSeries] = useState([])
  const [connected, setConnected] = useState(false)
  const wsRef = useRef(null)

  useEffect(() => {
    // Binance WebSocket endpoint
    const streams = symbols.map(s => `${s.toLowerCase()}@trade`).join('/')
    const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`
    
    console.log('Connecting to Binance WebSocket...')
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.addEventListener('open', () => {
      console.log('✅ Binance WebSocket connected')
      setConnected(true)
    })

    ws.addEventListener('message', (event) => {
      try {
        const message = JSON.parse(event.data)
        
        if (message.data) {
          const { s: symbol, p: price, E: timestamp } = message.data
          
          setPrices(prev => {
            const prevPrice = prev[symbol]?.price || price
            const change = ((price - prevPrice) / prevPrice * 100).toFixed(2)
            
            return {
              ...prev,
              [symbol]: {
                price: parseFloat(price).toFixed(2),
                timestamp,
                change: isNaN(change) ? '0.00' : change
              }
            }
          })

          // Update series for chart (use first symbol)
          if (symbol === symbols[0]) {
            setSeries(prev => {
              const newPoint = { 
                time: new Date(timestamp).toLocaleTimeString(), 
                price: parseFloat(price) 
              }
              const updated = [...prev, newPoint]
              return updated.slice(-100) // Keep last 100 points
            })
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    })

    ws.addEventListener('error', (error) => {
      console.error('WebSocket error:', error.message || 'Connection failed')
      setConnected(false)
    })

    ws.addEventListener('close', () => {
      console.log('⚠️ WebSocket disconnected, will reconnect in 5s...')
      setConnected(false)
      
      // Auto-reconnect after 5 seconds
      setTimeout(() => {
        console.log('Attempting to reconnect...')
      }, 5000)
    })

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }, [symbols.join(',')])

  return { prices, series, connected }
}
