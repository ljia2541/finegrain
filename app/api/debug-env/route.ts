import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  return NextResponse.json({
    PAYPAL_MODE: process.env.PAYPAL_MODE,
    PAYPAL_CLIENT_ID_preview: process.env.PAYPAL_CLIENT_ID?.substring(0, 10) + '...',
    has_client_secret: !!process.env.PAYPAL_CLIENT_SECRET,
  })
}
