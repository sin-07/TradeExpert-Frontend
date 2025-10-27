import { useEffect, useState, useRef } from 'react'

/**
 * Real-time Stock Prices using Yahoo Finance API
 * 
 * FREE & NO API KEY REQUIRED!
 * - Switched from Finnhub to Yahoo Finance
 * - Real-time updates via REST API
 * - Supports all US stocks (NASDAQ, NYSE)
 * 
 * Add your own symbols in Dashboard.jsx
 */

// Alternative: Real-time prices using REST API polling (more reliable for free tier)
export default function useRealTimePricesPolling(symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA']) {
  const [prices, setPrices] = useState({})
  const [series, setSeries] = useState([])
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef(null)

  const fetchPrices = async () => {
    try {
      // Use backend proxy to avoid CORS issues
      const symbolsQuery = symbols.join(',')
      const response = await fetch(
        `http://localhost:5000/api/stocks/us-stocks?symbols=${symbolsQuery}`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('US stocks data received:', data)

      if (data.quoteResponse && data.quoteResponse.result && data.quoteResponse.result.length > 0) {
        const newPrices = {}
        
        data.quoteResponse.result.forEach(quote => {
          const symbol = quote.symbol
          const price = quote.regularMarketPrice || quote.previousClose || 0
          const change = quote.regularMarketChangePercent || 0
          
          newPrices[symbol] = {
            price: price ? price.toFixed(2) : '0.00',
            change: change ? change.toFixed(2) : '0.00',
            high: (quote.regularMarketDayHigh || price).toFixed(2),
            low: (quote.regularMarketDayLow || price).toFixed(2),
            open: (quote.regularMarketOpen || price).toFixed(2),
            previousClose: (quote.previousClose || price).toFixed(2),
          }
        })

        setPrices(newPrices)

        // Update series for chart (use first symbol)
        if (newPrices[symbols[0]]) {
          setSeries(prev => {
            const newPoint = {
              time: new Date().toLocaleTimeString(),
              price: parseFloat(newPrices[symbols[0]].price)
            }
            const updated = [...prev, newPoint]
            return updated.slice(-50) // Keep last 50 points
          })
        }

        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching US stock prices:', error.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrices() // Initial fetch

    // Poll every 3 seconds (free tier limit: 60 calls/min)
    intervalRef.current = setInterval(fetchPrices, 3000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [symbols.join(',')])

  return { prices, series, loading }
}
