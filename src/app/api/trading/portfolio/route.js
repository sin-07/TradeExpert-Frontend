import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Portfolio from '@/lib/models/Portfolio';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const authResult = await verifyAuth(request);
    if (authResult.error) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    let portfolio = await Portfolio.findOne({ user: authResult.user._id });

    if (!portfolio) {
      portfolio = new Portfolio({
        user: authResult.user._id,
        balance: 50000,
        positions: [],
        totalPnL: 0,
      });
      await portfolio.save();
    }

    return NextResponse.json(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

