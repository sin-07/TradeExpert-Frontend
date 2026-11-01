import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query || query.length < 2) {
      return NextResponse.json({ message: 'Query must be at least 2 characters' }, { status: 400 });
    }

    const response = await fetch(
      `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=10&newsCount=0`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Search API error: ${response.status}`);
    }

    const data = await response.json();

    const results = (data.quotes || [])
      .filter(
        (quote) =>
          quote.quoteType === 'EQUITY' &&
          (quote.symbol?.includes('.NS') || quote.symbol?.includes('.BO') || !quote.symbol?.includes('.'))
      )
      .map((quote) => ({
        symbol: quote.symbol,
        name: quote.shortname || quote.longname || quote.symbol,
        exchange: quote.exchange,
        market: quote.symbol.includes('.NS') || quote.symbol.includes('.BO') ? 'indian' : 'us',
      }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error searching stocks:', error.message);
    return NextResponse.json({ message: 'Failed to search stocks', error: error.message }, { status: 500 });
  }
}
