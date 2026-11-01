import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import StockOrder from '@/lib/models/StockOrder';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const authResult = await verifyAuth(request);
    if (authResult.error) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);

    await connectDB();

    const orders = await StockOrder.find({ user: authResult.user._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await StockOrder.countDocuments({ user: authResult.user._id });

    return NextResponse.json({
      orders,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

