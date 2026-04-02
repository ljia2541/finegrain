import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession, createCreditCheckoutSession, createSubscriptionSession } from '@/lib/stripe'

export const runtime = 'nodejs'

/**
 * POST /api/stripe/checkout
 * 创建 Stripe Checkout Session
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { planType, planId, userId } = body

    if (!planType || !planId) {
      return NextResponse.json({ error: 'planType and planId are required' }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    let session

    if (planType === 'subscription') {
      session = await createSubscriptionSession(planId, userId)
    } else if (planType === 'credits') {
      session = await createCreditCheckoutSession(planId, userId)
    } else {
      return NextResponse.json({ error: 'Invalid planType' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    })
  } catch (error: any) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
