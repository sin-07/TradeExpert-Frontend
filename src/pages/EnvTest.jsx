import React from 'react'

export default function EnvTest() {
  const apiUrl = import.meta.env.VITE_API_URL || 'Not set'
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
        
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="text-sm text-gray-600">VITE_API_URL</p>
            <p className="text-lg font-mono break-all">{apiUrl}</p>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4">
            <p className="text-sm text-gray-600">Mode</p>
            <p className="text-lg font-mono">{import.meta.env.MODE}</p>
          </div>
          
          <div className="border-l-4 border-purple-500 pl-4">
            <p className="text-sm text-gray-600">All Environment Variables</p>
            <pre className="text-xs bg-gray-50 p-2 rounded mt-2 overflow-auto">
              {JSON.stringify(import.meta.env, null, 2)}
            </pre>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="font-semibold">Expected Value:</p>
            <p className="text-sm font-mono">https://tradeexpert-backend-1.onrender.com/api</p>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="font-semibold">Test API Call:</p>
            <button 
              onClick={async () => {
                try {
                  const response = await fetch(`${apiUrl}/health`)
                  const data = await response.json()
                  alert(`Success! Backend responded: ${JSON.stringify(data)}`)
                } catch (err) {
                  alert(`Error: ${err.message}`)
                }
              }}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Test Backend Connection
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
