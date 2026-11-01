import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import PendingUser from '@/lib/models/PendingUser';
import { sendOTPEmail } from '@/lib/email/emailService';

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email required' }, { status: 400 });
    }

    await connectDB();

    const pendingUser = await PendingUser.findOne({ email });
    if (!pendingUser) {
      return NextResponse.json({ message: 'No pending signup found. Please signup again.' }, { status: 400 });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    pendingUser.otp = otp;
    pendingUser.otpExpiry = otpExpiry;
    await pendingUser.save();

    try {
      await sendOTPEmail(email, otp, pendingUser.name);
    } catch (err) {
      console.error('Resend OTP email failed:', err.message);
    }

    return NextResponse.json({
      message: 'New OTP sent! Check your email.',
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
