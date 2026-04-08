import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  const mode = process.env.PAYPAL_MODE?.trim()
  const baseUrl = mode === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  // Test auth
  let authResult = 'not_tested'
  try {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    const res = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${auth}`,
      },
      body: 'grant_type=client_credentials',
    })
    authResult = `${res.status} ${await res.text()}`
  } catch (e: any) {
    authResult = e.message
  }

  return NextResponse.json({
    PAYPAL_MODE: mode,
    PAYPAL_BASE_URL: baseUrl,
    CLIENT_ID_preview: clientId?.substring(0, 10) + '...',
    SECRET_preview: clientSecret?.substring(0, 10) + '...',
    auth_test: authResult.substring(0, 200),
  })
}
