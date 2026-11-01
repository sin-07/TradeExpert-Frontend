import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(request) {
  try {
    const { email, resetToken, newPassword } = await request.json();

    if (!email || !resetToken || !newPassword) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    if (resetToken.length !== 6) {
      return NextResponse.json({ message: 'Reset code must be 6 digits' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({
      email,
      resetToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid or expired reset code' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({
      message: 'Password reset successful! You can now login with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ message: 'Server error. Please try again.' }, { status: 500 });
  }
}

