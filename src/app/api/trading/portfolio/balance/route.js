import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Portfolio from '@/lib/models/Portfolio';

export async function PUT(request) {
  try {
    const authResult = await verifyAuth(request);
    if (authResult.error) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status });
    }

    const { amount } = await request.json();

    if (typeof amount !== 'number' || amount < 0) {
      return NextResponse.json({ message: 'Invalid amount' }, { status: 400 });
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
      portfolio.balance = amount;
    }

    await portfolio.save();

    return NextResponse.json({ message: 'Balance updated successfully', balance: portfolio.balance });
  } catch (error) {
    console.error('Error updating balance:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

