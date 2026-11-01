import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const authResult = await verifyAuth(request);
  if (authResult.error) {
    return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  }

  return NextResponse.json(authResult.user);
}

