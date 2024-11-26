import { NextResponse } from 'next/server';
import { getLongUrl, getUrlStats } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { shortCode: string } }
) {
  const { longUrl, expired } = getLongUrl(params.shortCode);
  const stats = getUrlStats(params.shortCode);

  if (longUrl) {
    return NextResponse.json({ longUrl, expired, stats });
  } else {
    return NextResponse.json({ longUrl: null, expired, stats: null }, { status: 404 });
  }
}

