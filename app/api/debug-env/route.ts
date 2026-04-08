import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  const mode = process.env.PAYPAL_MODE?.trim()
  const baseUrl = mode === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'

  return NextResponse.json({
    PAYPAL_MODE: mode,
    PAYPAL_BASE_URL: baseUrl,
    CLIENT_ID_preview: process.env.PAYPAL_CLIENT_ID?.substring(0, 15) + '...',
    SECRET_preview: process.env.PAYPAL_CLIENT_SECRET?.substring(0, 15) + '...',
    PLAN_PRO: process.env.PAYPAL_PLAN_PRO,
    PLAN_MAX: process.env.PAYPAL_PLAN_MAX,
    PLAN_ULTRA: process.env.PAYPAL_PLAN_ULTRA,
  })
}
