import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbols = searchParams.get('symbols');

    if (!symbols) {
      return NextResponse.json({ message: 'Symbols parameter required' }, { status: 400 });
    }

    const symbolList = symbols.split(',');

    const promises = symbolList.map(async (symbol) => {
      try {
        const response = await fetch(
          `https://query2.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`,
          {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Accept': 'application/json',
            },
            next: { revalidate: 2 },
          }
        );

        if (!response.ok) return null;

        const data = await response.json();

        if (data.chart && data.chart.result && data.chart.result[0]) {
          const result = data.chart.result[0];
          const meta = result.meta;

          return {
            symbol: symbol,
            regularMarketPrice: meta.regularMarketPrice || meta.previousClose,
            previousClose: meta.previousClose,
            regularMarketChangePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose * 100),
            regularMarketDayHigh: meta.regularMarketDayHigh,
            regularMarketDayLow: meta.regularMarketDayLow,
            regularMarketOpen: meta.regularMarketOpen,
            regularMarketVolume: meta.regularMarketVolume,
            shortName: symbol.replace('.NS', '').replace('.BO', ''),
          };
        }
        return null;
      } catch (error) {
        console.error(`Error fetching ${symbol}:`, error.message);
        return null;
      }
    });

    const results = await Promise.all(promises);
    const validResults = results.filter((r) => r !== null);

    return NextResponse.json({
      quoteResponse: {
        result: validResults,
      },
    });
  } catch (error) {
    console.error('Error fetching stock data:', error.message);
    return NextResponse.json({ message: 'Failed to fetch stock data', error: error.message }, { status: 500 });
  }
}
