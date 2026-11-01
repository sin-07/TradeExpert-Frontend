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
    const portfolio = await Portfolio.findOne({ user: authResult.user._id });

    if (!portfolio) {
      return NextResponse.json({ positions: [] });
    }

    return NextResponse.json({ positions: portfolio.positions });
  } catch (error) {
    console.error('Error fetching positions:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

