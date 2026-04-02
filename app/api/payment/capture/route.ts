import { NextRequest, NextResponse } from 'next/server'
import { captureOrder } from '@/lib/paypal'

export const runtime = 'nodejs'

/**
 * POST /api/payment/capture
 * 捕获（确认）PayPal 支付
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId } = body

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 })
    }

    const capture = await captureOrder(orderId)
    
    if (capture.status === 'COMPLETED') {
      const customId = capture.purchaseUnits?.[0]?.customId
      const amount = capture.purchaseUnits?.[0]?.amount?.value
      const currency = capture.purchaseUnits?.[0]?.amount?.currencyCode

      return NextResponse.json({
        success: true,
        status: capture.status,
        orderId: capture.id,
        customId,
        amount,
        currency,
      })
    }

    return NextResponse.json({
      success: false,
      status: capture.status,
      orderId: capture.id,
    }, { status: 400 })
  } catch (error: any) {
    console.error('Capture error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to capture payment' },
      { status: 500 }
    )
  }
}
