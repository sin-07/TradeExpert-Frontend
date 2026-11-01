import { useEffect, useState } from 'react'

export default function useLivePrices(initialSeries) {
  const [series, setSeries] = useState(initialSeries)

  useEffect(() => {
    const id = setInterval(() => {
      setSeries((s) => {
        const last = s[s.length - 1].price
        const change = (Math.random() - 0.45) * 3
        const next = +Math.max(1, last + change).toFixed(2)
        const newSeries = [...s.slice(1), { time: +s[s.length - 1].time + 1, price: next }]
        return newSeries
      })
    }, 1500)
    return () => clearInterval(id)
  }, [])

  return [series, setSeries]
}
