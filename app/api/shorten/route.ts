import { NextResponse } from 'next/server';
import { createShortUrl } from '@/lib/db';

export async function POST(request: Request) {
  const { url, expiresIn } = await request.json();
  
  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  if (!expiresIn || typeof expiresIn !== 'number') {
    return NextResponse.json({ error: 'Valid expiration time is required' }, { status: 400 });
  }

  try {
    const shortCode = createShortUrl(url, expiresIn);
    const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/s/${shortCode}`;
    return NextResponse.json({ shortUrl });
  } catch (error) {
    console.error('Error creating short URL:', error);
    return NextResponse.json({ error: 'Failed to create short URL' }, { status: 500 });
  }
}

