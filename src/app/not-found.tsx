import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#070b12] text-slate-100 selection:bg-cyan-500 selection:text-black">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="w-full max-w-md p-8 rounded-3xl bg-[#0b101b] border border-white/10 shadow-2xl space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto text-cyan-400 font-mono text-2xl font-black">
            404
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Terminal Route Not Found</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            The market, terminal route, or resource you are looking for does not exist or has been relocated.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/20"
            >
              Return to Terminal
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

