import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import StockOrder from '@/lib/models/StockOrder';
import Portfolio from '@/lib/models/Portfolio';
import User from '@/lib/models/User';
import { sendOrderConfirmationEmail } from '@/lib/email/emailService';

export async function POST(request) {
  try {
    const authResult = await verifyAuth(request);
    if (authResult.error) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status });
    }

    const { symbol, stockName, orderType, side, quantity, price, market } = await request.json();

    if (!symbol || !stockName || !orderType || !side || !quantity || !price || !market) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    if (quantity <= 0) {
      return NextResponse.json({ message: 'Quantity must be greater than 0' }, { status: 400 });
    }

    if (price <= 0) {
      return NextResponse.json({ message: 'Price must be greater than 0' }, { status: 400 });
    }

    const totalAmount = parseFloat((quantity * price).toFixed(2));

    await connectDB();
    let portfolio = await Portfolio.findOne({ user: authResult.user._id });
    if (!portfolio) {
      portfolio = new Portfolio({
        user: authResult.user._id,
        balance: 50000,
        positions: [],
      });
    }

    if (side === 'Buy') {
      if (portfolio.balance < totalAmount) {
        return NextResponse.json({
          message: `Insufficient balance. Required: ₹${totalAmount.toFixed(2)}, Available: ₹${portfolio.balance.toFixed(2)}`,
        }, { status: 400 });
      }

      portfolio.balance -= totalAmount;

      const existingPosition = portfolio.positions.find(
        (pos) => pos.symbol === symbol && pos.side === 'Buy'
      );

      if (existingPosition) {
        const prevCost = existingPosition.averagePrice * existingPosition.quantity;
        const newCost = price * quantity;
        const totalQty = existingPosition.quantity + quantity;
        existingPosition.averagePrice = (prevCost + newCost) / totalQty;
        existingPosition.quantity = totalQty;
        existingPosition.lastUpdated = new Date();
      } else {
        portfolio.positions.push({
          symbol,
          stockName,
          side: 'Buy',
          quantity,
          averagePrice: price,
          market,
          lastUpdated: new Date(),
        });
      }
    } else if (side === 'Sell') {
      const position = portfolio.positions.find(
        (pos) => pos.symbol === symbol && pos.side === 'Buy'
      );

      if (!position || position.quantity < quantity) {
        return NextResponse.json({
          message: `Insufficient stock quantity. You have ${position ? position.quantity : 0} shares of ${symbol}`,
        }, { status: 400 });
      }

      portfolio.balance += totalAmount;
      position.quantity -= quantity;
      position.lastUpdated = new Date();

      if (position.quantity === 0) {
        portfolio.positions = portfolio.positions.filter(
          (pos) => !(pos.symbol === symbol && pos.side === 'Buy')
        );
      }
    }

    await portfolio.save();

    const order = new StockOrder({
      user: authResult.user._id,
      symbol,
      stockName,
      orderType,
      side,
      quantity,
      price,
      totalAmount,
      status: 'Filled',
      market,
      executedAt: new Date(),
    });

    await order.save();

    const user = await User.findById(authResult.user._id);
    if (user && user.email) {
      sendOrderConfirmationEmail(user.email, user.name, {
        orderId: order._id.toString().slice(-8).toUpperCase(),
        symbol,
        stockName,
        side,
        orderType,
        quantity,
        price,
        totalAmount,
        market,
        executedAt: order.executedAt,
      }).catch((err) => {
        console.error('Failed to send order confirmation email:', err);
      });
    }

    return NextResponse.json({
      message: `Order ${side.toLowerCase()} successfully!`,
      order,
      portfolio: {
        balance: portfolio.balance,
        positions: portfolio.positions,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

