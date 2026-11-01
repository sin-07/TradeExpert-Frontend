import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import PendingUser from '@/lib/models/PendingUser';
import { sendWelcomeEmail } from '@/lib/email/emailService';

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ message: 'Email and OTP are required' }, { status: 400 });
    }

    await connectDB();

    const pendingUser = await PendingUser.findOne({ email });
    if (!pendingUser) {
      return NextResponse.json({ message: 'No pending signup found. Please signup again.' }, { status: 400 });
    }

    if (!pendingUser.otp || !pendingUser.otpExpiry) {
      return NextResponse.json({ message: 'No OTP found. Please request a new one.' }, { status: 400 });
    }

    if (new Date() > pendingUser.otpExpiry) {
      return NextResponse.json({ message: 'OTP has expired. Please request a new one.' }, { status: 400 });
    }

    if (pendingUser.otp !== otp) {
      return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
    }

    const user = new User({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password,
      isVerified: true,
    });
    await user.save();

    await PendingUser.deleteOne({ email });

    try {
      await sendWelcomeEmail(pendingUser.email, pendingUser.name);
    } catch (err) {
      console.warn('Welcome email sending failed (non-blocking):', err.message);
    }

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    return NextResponse.json({
      message: 'Email verified successfully! Welcome to TradeXpert.',
      token,
      user: { id: user._id, name: user.name, email: user.email, isVerified: user.isVerified },
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

