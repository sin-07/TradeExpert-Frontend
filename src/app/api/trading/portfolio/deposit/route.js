import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Portfolio from '@/lib/models/Portfolio';

export async function POST(request) {
  try {
    const authResult = await verifyAuth(request);
    if (authResult.error) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status });
    }

    const { amount = 50000 } = await request.json().catch(() => ({ amount: 50000 }));

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ message: 'Amount must be greater than 0' }, { status: 400 });
    }

    await connectDB();
    let portfolio = await Portfolio.findOne({ user: authResult.user._id });

    if (!portfolio) {
      portfolio = new Portfolio({
        user: authResult.user._id,
        balance: amount,
        positions: [],
      });
    } else {
      portfolio.balance += amount;
    }

    await portfolio.save();

    return NextResponse.json({
      message: `Successfully deposited ₹${amount.toLocaleString()} into your virtual account!`,
      balance: portfolio.balance,
    });
  } catch (error) {
    console.error('Deposit error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

