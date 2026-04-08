import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth'
import { SUBSCRIPTION_CONFIG } from '@/lib/paypal'

const PAYPAL_BASE_URL = process.env.PAYPAL_MODE?.trim() === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID!
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
  const res = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${auth}`,
    },
    body: 'grant_type=client_credentials',
  })
  if (!res.ok) throw new Error(`PayPal auth failed: ${res.status}`)
  const data = await res.json()
  return data.access_token
}

export const runtime = 'nodejs'

/**
 * POST /api/payment/create-subscription
 * 创建 PayPal 月订阅
 * 
 * 流程：
 * 1. 用 Plan ID 创建 Subscription
 * 2. 返回 approve_url 让用户同意
 * 3. Webhook 处理 ACTIVATED/RENEWED/CANCELLED
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { planId } = body

    if (!planId || !['pro', 'max', 'ultra'].includes(planId)) {
      return NextResponse.json({ error: 'Invalid planId' }, { status: 400 })
    }

    // 需要登录
    const session = await getAuthSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'LOGIN_REQUIRED' }, { status: 401 })
    }

    const userId = session.user.id
    const config = SUBSCRIPTION_CONFIG[planId as keyof typeof SUBSCRIPTION_CONFIG]
    if (!config) {
      return NextResponse.json({ error: 'Invalid plan configuration' }, { status: 400 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.finegrainimageenhancer.com'
    const token = await getAccessToken()

    // 创建订阅
    const res = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        plan_id: process.env[`PAYPAL_PLAN_${planId.toUpperCase()}`] || '',
        custom_id: JSON.stringify({ planId, userId }),
        application_context: {
          brand_name: 'FineGrain',
          user_action: 'SUBSCRIBE_NOW',
          shipping_preference: 'NO_SHIPPING',
          return_url: `${appUrl}/payment/success?subscription=1`,
          cancel_url: `${appUrl}/payment/cancel?subscription=1`,
        },
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('Create subscription error:', text)
      return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
    }

    const subscription = await res.json()

    // 从 links 中提取 approve_url
    const approveUrl = subscription.links?.find(
      (link: any) => link.rel === 'approve'
    )?.href || ''

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
      status: subscription.status,
      approveUrl,
    })
  } catch (error: any) {
    console.error('Create subscription error:', error)
    return NextResponse.json({ error: error.message || 'Failed to create subscription' }, { status: 500 })
  }
}
