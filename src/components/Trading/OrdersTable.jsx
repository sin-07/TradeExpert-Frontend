import React from 'react'

export default function OrdersTable({ orders }) {
  return (
    <div>
      <h4 className="font-medium mb-2">Order Book</h4>
      <div className="max-h-48 overflow-auto text-sm">
        {orders.length===0 ? <div className="py-6 text-slate-400">No orders yet</div> : (
          <table className="w-full">
            <thead className="text-xs text-slate-500"><tr><th className="text-left">Time</th><th>Sym</th><th>Side</th><th>Qty</th><th>Price</th></tr></thead>
            <tbody>
              {orders.map(o=>(
                <tr key={o.id} className="border-t">
                  <td className="py-2 text-xs">{o.time}</td>
                  <td className="font-medium">{o.symbol}</td>
                  <td className="text-sm">{o.side}</td>
                  <td>{o.qty}</td>
                  <td>{o.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
