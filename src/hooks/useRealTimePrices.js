import { useEffect, useState, useRef } from 'react'

// Real-time WebSocket hook for stock prices using Finnhub
export default function useLivePrices(symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA']) {
  const [prices, setPrices] = useState({})
  const [series, setSeries] = useState([])
  const [connected, setConnected] = useState(false)
  const wsRef = useRef(null)

  useEffect(() => {
    // Finnhub Free API Key (you should replace with your own)
    const API_KEY = 'ct0ihppr01qhm05k6c90ct0ihppr01qhm05k6c9g'
    
    // Connect to Finnhub WebSocket
    const ws = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`)
    wsRef.current = ws

    ws.addEventListener('open', () => {
      console.log('WebSocket connected')
      setConnected(true)
      
      // Subscribe to symbols
      symbols.forEach(symbol => {
        ws.send(JSON.stringify({ type: 'subscribe', symbol }))
      })
    })

    ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data)
      
      if (message.type === 'trade') {
        message.data.forEach(trade => {
          const { s: symbol, p: price, t: timestamp } = trade
          
          setPrices(prev => ({
            ...prev,
            [symbol]: {
              price: price.toFixed(2),
              timestamp,
              change: prev[symbol] ? ((price - prev[symbol].price) / prev[symbol].price * 100).toFixed(2) : 0
            }
          }))

          // Update series for chart (use first symbol)
          if (symbol === symbols[0]) {
            setSeries(prev => {
              const newPoint = { 
                time: new Date(timestamp).toLocaleTimeString(), 
                price: parseFloat(price.toFixed(2)) 
              }
              const updated = [...prev, newPoint]
              return updated.slice(-50) // Keep last 50 points
            })
          }
        })
      }
    })

    ws.addEventListener('error', (error) => {
      console.error('WebSocket error:', error)
      setConnected(false)
    })

    ws.addEventListener('close', () => {
      console.log('WebSocket disconnected')
      setConnected(false)
    })

    // Cleanup on unmount
    return () => {
      symbols.forEach(symbol => {
        ws.send(JSON.stringify({ type: 'unsubscribe', symbol }))
      })
      ws.close()
    }
  }, [symbols.join(',')])

  return { prices, series, connected }
}
