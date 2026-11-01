import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import Portfolio from '@/lib/models/Portfolio';

export async function POST() {
  try {
    await connectDB();

    const demoEmail = 'demo@tradexpert.com';
    let user = await User.findOne({ email: demoEmail });

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('DemoTrader@2026', salt);

      user = new User({
        name: 'Demo Trader',
        email: demoEmail,
        password: hashedPassword,
        isVerified: true,
      });
      await user.save();
    }

    // Ensure demo portfolio exists
    let portfolio = await Portfolio.findOne({ user: user._id });
    if (!portfolio) {
      portfolio = new Portfolio({
        user: user._id,
        balance: 50000,
        positions: [],
        totalPnL: 0,
      });
      await portfolio.save();
    } else if (portfolio.balance < 5000) {
      // Auto-topup if demo balance is low
      portfolio.balance = 50000;
      await portfolio.save();
    }

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    return NextResponse.json({
      message: 'Demo login successful! Welcome to TradeXpert.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: true,
      },
      portfolio: {
        balance: portfolio.balance,
      },
    });
  } catch (error) {
    console.error('Demo login error:', error);
    return NextResponse.json({ message: 'Failed to initialize demo login', error: error.message }, { status: 500 });
  }
}

