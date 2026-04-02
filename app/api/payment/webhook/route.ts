import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

/**
 * POST /api/payment/webhook
 * PayPal Webhook 回调
 * 
 * 用于接收：
 * 1. 一次性支付完成通知
 * 2. 月订阅创建/续费/取消通知
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const eventType = body.event_type

    // 验证 Webhook 签名（生产环境必须）
    // const isValid = await verifyWebhookSignature(request)
    // if (!isValid) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })

    console.log('PayPal webhook received:', eventType, body.id)

    switch (eventType) {
      case 'CHECKOUT.ORDER.APPROVED':
        // 订单已批准（用户点了支付但还没 confirm）
        console.log('Order approved:', body.resource?.id)
        break

      case 'CHECKOUT.ORDER.COMPLETED':
        // 订单已完成（支付成功）
        const orderId = body.resource?.id
        const customId = body.resource?.purchase_units?.[0]?.customId
        const amount = body.resource?.purchase_units?.[0]?.amount?.value

        if (customId) {
          const { planType, planId, userId } = JSON.parse(customId)
          console.log(`Payment completed: planType=${planType}, planId=${planId}, userId=${userId}, amount=${amount}`)

          // TODO: 这里接入 Supabase 加积分
          // if (planType === 'credits') {
          //   await addCredits(userId, parseInt(planId))
          // }
        }
        break

      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        // 月订阅激活
        console.log('Subscription activated:', body.resource?.id)
        break

      case 'BILLING.SUBSCRIPTION.RENEWED':
        // 月订阅续费成功
        console.log('Subscription renewed:', body.resource?.id)
        // TODO: 每月重置积分
        break

      case 'BILLING.SUBSCRIPTION.CANCELLED':
        // 月订阅取消
        console.log('Subscription cancelled:', body.resource?.id)
        // TODO: 保留积分到月底
        break

      default:
        console.log('Unhandled event:', eventType)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
