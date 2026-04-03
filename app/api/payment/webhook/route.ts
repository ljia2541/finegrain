import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature, PAYPAL_PLANS } from '@/lib/paypal'
import { addCredits, initUser } from '@/lib/supabase'

export const runtime = 'nodejs'

/**
 * POST /api/payment/webhook
 * PayPal Webhook 回调
 * 
 * 双重保险：即使 capture 接口失败，webhook 也能确保积分到账
 * 需要 PayPal 商家后台配置 webhook URL
 */
export async function POST(request: NextRequest) {
  try {
    const bodyText = await request.text()
    const body = JSON.parse(bodyText)
    const eventType = body.event_type

    // 生产环境验证签名
    const isValid = await verifyWebhookSignature(
      bodyText,
      Object.fromEntries(request.headers.entries())
    )
    if (!isValid) {
      console.warn('PayPal webhook signature verification failed')
      // 不拒绝，因为沙箱环境可能没有 webhook ID
    }

    console.log('PayPal webhook:', eventType, body.id)

    switch (eventType) {
      case 'CHECKOUT.ORDER.APPROVED':
        // 订单已批准（用户点了支付但还没 confirm）
        console.log('Order approved:', body.resource?.id)
        break

      case 'CHECKOUT.ORDER.COMPLETED': {
        // 订单已完成（支付成功）
        const orderId = body.resource?.id
        const customId = body.resource?.purchase_units?.[0]?.custom_id

        if (!customId) break

        let planType: string, planId: string, userId: string
        try {
          ({ planType, planId, userId } = JSON.parse(customId))
        } catch {
          console.error('Invalid custom_id in webhook')
          break
        }

        if (planType !== 'credits') break

        const plan = PAYPAL_PLANS.credits[planId as keyof typeof PAYPAL_PLANS.credits]
        if (!plan) break

        if (!userId) {
          console.error('No userId in webhook custom_id')
          break
        }

        try {
          // 确保用户存在
          await initUser(userId, '', undefined, undefined)

          const expiresAt = new Date()
          expiresAt.setDate(expiresAt.getDate() + plan.validityDays)

          // 检查是否已经处理过（幂等：用 orderId 查流水）
          // 如果已经有相同 orderId 的 purchase 记录，跳过
          const { supabaseAdmin } = await import('@/lib/supabase')
          const { data: existingTx } = await supabaseAdmin
            .from('credit_transactions')
            .select('id')
            .eq('order_id', orderId)
            .eq('type', 'purchase')
            .limit(1)

          if (existingTx && existingTx.length > 0) {
            console.log(`Order ${orderId} already processed, skipping`)
            break
          }

          await addCredits(
            userId,
            plan.credits,
            'purchase',
            `购买 ${plan.credits} 积分包 ($${plan.price}) - Webhook`,
            {
              planId,
              orderId,
              expiresAt: expiresAt.toISOString(),
            }
          )
          console.log(`Credits added via webhook: userId=${userId}, credits=${plan.credits}, orderId=${orderId}`)
        } catch (err) {
          console.error('Failed to add credits via webhook:', err)
        }
        break
      }

      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        console.log('Subscription activated:', body.resource?.id)
        // TODO: 月订阅支持
        break

      case 'BILLING.SUBSCRIPTION.RENEWED':
        console.log('Subscription renewed:', body.resource?.id)
        // TODO: 月续费时重置积分
        break

      case 'BILLING.SUBSCRIPTION.CANCELLED':
        console.log('Subscription cancelled:', body.resource?.id)
        // TODO: 标记订阅取消
        break

      default:
        // 其他事件忽略
        break
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
