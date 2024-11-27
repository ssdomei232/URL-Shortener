import { NextResponse } from 'next/server'
import { getLongUrl, getUrlStats } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { shortCode: string } }
) {
  try {
    const { longUrl, expired } = getLongUrl(params.shortCode)
    const stats = getUrlStats(params.shortCode)

    if (!longUrl) {
      return NextResponse.json(
        { error: 'URL not found', expired },
        { status: 404 }
      )
    }

    return NextResponse.json({ longUrl, expired, stats })
  } catch (error) {
    console.error('Error fetching URL:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
