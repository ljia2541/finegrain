import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/stripe'

export const runtime = 'nodejs'

/**
 * POST /api/stripe/webhook
 * Stripe Webhook 回调
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature') || ''

    let event
    try {
      event = verifyWebhookSignature(body, signature)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    console.log('Stripe webhook received:', event.type)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.client_reference_id
        const metadata = session.metadata || {}

        console.log(`Checkout completed: userId=${userId}, metadata=${JSON.stringify(metadata)}`)

        // TODO: 接入 Supabase
        // if (metadata.planType === 'credits') {
        //   const planConfig = STRIPE_PRICES.credits[metadata.planId]
        //   await addCredits(userId, planConfig.credits, 'purchase', `Stripe 购买 ${metadata.planId} 积分包`, {
        //     planId: metadata.planId,
        //     orderId: session.payment_intent as string,
        //     expiresAt: new Date(Date.now() + planConfig.validityDays * 86400000).toISOString(),
        //   })
        // }
        // if (metadata.planType === 'subscription') {
        //   // 创建/更新订阅记录
        // }
        break
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object
        console.log('Subscription created:', subscription.id)
        // TODO: 创建订阅记录
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object
        console.log('Subscription updated:', subscription.id, subscription.status)
        // TODO: 更新订阅状态
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object
        console.log('Invoice payment succeeded:', invoice.id)
        // TODO: 月订阅续费成功，重置积分
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        console.log('Invoice payment failed:', invoice.id)
        // TODO: 月订阅续费失败，通知用户
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        console.log('Subscription cancelled:', subscription.id)
        // TODO: 更新订阅状态为 cancelled
        break
      }

      default:
        console.log('Unhandled Stripe event:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
