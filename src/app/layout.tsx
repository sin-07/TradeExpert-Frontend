import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'TradeXpert | Institutional Paper Trading & Analytics Terminal',
  description: 'Trade NSE stocks, US equities, and crypto with real-time streaming market data, technical charts, live order execution, and paper portfolio trading.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#070b12] text-slate-100 antialiased min-h-screen flex flex-col selection:bg-cyan-500 selection:text-black">
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#0d1322',
                color: '#f8fafc',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '13px',
                borderRadius: '12px',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#0d1322',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#0d1322',
                },
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
