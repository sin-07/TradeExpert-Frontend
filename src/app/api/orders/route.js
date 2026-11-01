import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const authResult = await verifyAuth(request);
    if (authResult.error) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const orders = await Order.find({ user: authResult.user._id }).populate('items.product');
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const authResult = await verifyAuth(request);
    if (authResult.error) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status });
    }

    const { items, total } = await request.json();
    await connectDB();
    const order = new Order({ user: authResult.user._id, items, total });
    await order.save();
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

