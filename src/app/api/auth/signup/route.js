import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import PendingUser from '@/lib/models/PendingUser';
import { sendOTPEmail } from '@/lib/email/emailService';

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Name, email, and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters' }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await PendingUser.deleteOne({ email });

    const pendingUser = new PendingUser({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
    });
    await pendingUser.save();

    try {
      await sendOTPEmail(email, otp, name);
    } catch (err) {
      console.error('Email sending error:', err.message);
    }

    return NextResponse.json({
      message: 'Signup successful! Please check your email for the OTP code.',
      email,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
