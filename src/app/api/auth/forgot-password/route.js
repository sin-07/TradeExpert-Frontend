import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { sendPasswordResetEmail } from '@/lib/email/emailService';

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Valid email required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'No account found with this email' }, { status: 404 });
    }

    const resetToken = generateOTP();
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    try {
      await sendPasswordResetEmail(email, resetToken, user.name);
    } catch (emailErr) {
      console.warn('Password reset email sending failed (non-blocking):', emailErr.message);
    }

    return NextResponse.json({
      message: 'Password reset code sent to your email',
      email,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ message: 'Server error. Please try again.' }, { status: 500 });
  }
}

