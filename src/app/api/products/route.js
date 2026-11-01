import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find().limit(100);
    return NextResponse.json(products);
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

    const { title, description, price, images } = await request.json();
    await connectDB();
    const product = new Product({ title, description, price, images: images || [] });
    await product.save();
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

