import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const interval = searchParams.get('interval') || '5m';
    const range = searchParams.get('range') || '1d';

    if (!symbol) {
      return NextResponse.json({ message: 'Symbol parameter required' }, { status: 400 });
    }

    const response = await fetch(
      `https://query2.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        },
        next: { revalidate: 10 },
      }
    );

    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching historical data:', error.message);
    return NextResponse.json({ message: 'Failed to fetch historical data', error: error.message }, { status: 500 });
  }
}
