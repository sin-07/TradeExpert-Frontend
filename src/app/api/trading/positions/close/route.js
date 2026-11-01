import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Portfolio from '@/lib/models/Portfolio';
import StockOrder from '@/lib/models/StockOrder';

export async function POST(request) {
  try {
    const authResult = await verifyAuth(request);
    if (authResult.error) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status });
    }

    const { symbol, currentPrice } = await request.json();

    if (!symbol) {
      return NextResponse.json({ message: 'Symbol is required' }, { status: 400 });
    }

    await connectDB();
    const portfolio = await Portfolio.findOne({ user: authResult.user._id });

    if (!portfolio) {
      return NextResponse.json({ message: 'Portfolio not found' }, { status: 404 });
    }

    const positionIndex = portfolio.positions.findIndex(p => p.symbol === symbol);
    if (positionIndex === -1) {
      return NextResponse.json({ message: 'Position not found' }, { status: 404 });
    }

    const pos = portfolio.positions[positionIndex];
    const exitPrice = currentPrice && currentPrice > 0 ? currentPrice : pos.averagePrice;
    const totalProceeds = parseFloat((pos.quantity * exitPrice).toFixed(2));

    portfolio.balance += totalProceeds;
    portfolio.positions.splice(positionIndex, 1);
    await portfolio.save();

    // Create order record for position close
    const order = new StockOrder({
      user: authResult.user._id,
      symbol: pos.symbol,
      stockName: pos.stockName || pos.symbol,
      orderType: 'Market',
      side: 'Sell',
      quantity: pos.quantity,
      price: exitPrice,
      totalAmount: totalProceeds,
      status: 'Filled',
      market: pos.market || 'indian',
      executedAt: new Date(),
    });
    await order.save();

    return NextResponse.json({
      message: `Successfully closed position in ${symbol} for ₹${totalProceeds.toFixed(2)}`,
      portfolio: {
        balance: portfolio.balance,
        positions: portfolio.positions,
      },
      order,
    });
  } catch (error) {
    console.error('Close position error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

