import React from 'react'

export default function PositionsTable({ positions }) {
  return (
    <div>
      <h4 className="font-medium mb-2">Open Positions</h4>
      <table className="w-full text-sm">
        <thead className="text-slate-500 text-xs"><tr><th className="text-left">Symbol</th><th>Side</th><th>Qty</th><th>Avg</th></tr></thead>
        <tbody>
          {positions.length===0 ? <tr><td colSpan={4} className="py-4 text-slate-400">No positions</td></tr> : positions.map(p=>(
            <tr key={p.symbol} className="border-t"><td className="py-2 font-medium">{p.symbol}</td><td>{p.side}</td><td>{p.qty}</td><td>₹{p.avg}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
