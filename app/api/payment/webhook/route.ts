import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature, PAYPAL_PLANS, SUBSCRIPTION_CONFIG } from '@/lib/paypal'
import { addCredits, initUser } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase'

export const runtime = 'nodejs'

/**
 * POST /api/payment/webhook
 * PayPal Webhook 回调
 * 
 * 处理事件：
 * 1. CHECKOUT.ORDER.COMPLETED - 一次性支付成功（积分包）
 * 2. BILLING.SUBSCRIPTION.ACTIVATED - 月订阅激活（加首次积分）
 * 3. BILLING.SUBSCRIPTION.RENEWED - 月订阅续费（每月加积分）
 * 4. BILLING.SUBSCRIPTION.CANCELLED - 月订阅取消
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
    }

    console.log('PayPal webhook:', eventType, body.id)

    switch (eventType) {
      case 'CHECKOUT.ORDER.APPROVED':
        console.log('Order approved:', body.resource?.id)
        break

      case 'CHECKOUT.ORDER.COMPLETED': {
        const orderId = body.resource?.id
        const customId = body.resource?.purchase_units?.[0]?.custom_id
        if (!customId) break

        let planType: string, planId: string, userId: string
        try {
          ({ planType, planId, userId } = JSON.parse(customId))
        } catch {
          break
        }

        if (planType !== 'credits') break

        const plan = PAYPAL_PLANS.credits[planId as keyof typeof PAYPAL_PLANS.credits]
        if (!plan || !userId) break

        try {
          await initUser(userId, '', undefined, undefined)

          // 幂等：用 orderId 去重
          const { data: existingTx } = await supabaseAdmin
            .from('credit_transactions')
            .select('id')
            .eq('order_id', orderId)
            .eq('type', 'purchase')
            .limit(1)

          if (existingTx && existingTx.length > 0) break

          const expiresAt = new Date()
          expiresAt.setDate(expiresAt.getDate() + plan.validityDays)

          await addCredits(userId, plan.credits, 'purchase', `购买 ${plan.credits} 积分包 ($${plan.price}) - Webhook`, {
            planId,
            orderId,
            expiresAt: expiresAt.toISOString(),
          })
          console.log(`Credits added via webhook: userId=${userId}, credits=${plan.credits}`)
        } catch (err) {
          console.error('Failed to add credits via webhook:', err)
        }
        break
      }

      case 'BILLING.SUBSCRIPTION.ACTIVATED': {
        // 月订阅首次激活
        const subId = body.resource?.id
        const customId = body.resource?.custom_id
        if (!customId) {
          console.error('Subscription activated without custom_id:', subId)
          break
        }

        let planId: string, userId: string
        try {
          ({ planId, userId } = JSON.parse(customId))
        } catch {
          break
        }

        const config = SUBSCRIPTION_CONFIG[planId as keyof typeof SUBSCRIPTION_CONFIG]
        if (!config || !userId) break

        try {
          await initUser(userId, '', undefined, undefined)

          // 记录订阅
          const now = new Date()
          const periodEnd = new Date(now)
          periodEnd.setMonth(periodEnd.getMonth() + 1)

          await supabaseAdmin.from('subscriptions').upsert({
            user_id: userId,
            plan_id: planId,
            paypal_subscription_id: subId,
            status: 'active',
            credits_per_month: config.credits,
            current_credits: config.credits,
            started_at: now.toISOString(),
            current_period_start: now.toISOString(),
            current_period_end: periodEnd.toISOString(),
          }, { onConflict: 'paypal_subscription_id' })

          // 首次积分到账（月订阅积分 → subscription_balance）
          await addCredits(userId, config.credits, 'subscription', `${config.name} 首月积分 (${config.credits}积分)`, {
            planId,
            creditSource: 'subscription',
          })

          console.log(`Subscription activated: userId=${userId}, plan=${planId}, credits=${config.credits}`)
        } catch (err) {
          console.error('Failed to activate subscription:', err)
        }
        break
      }

      case 'BILLING.SUBSCRIPTION.RENEWED': {
        // 月订阅续费
        const subId = body.resource?.id

        // 查找订阅记录
        const { data: sub } = await supabaseAdmin
          .from('subscriptions')
          .select('*')
          .eq('paypal_subscription_id', subId)
          .single()

        if (!sub) {
          console.error('Subscription renewed but not found:', subId)
          break
        }

        const config = SUBSCRIPTION_CONFIG[sub.plan_id as keyof typeof SUBSCRIPTION_CONFIG]
        if (!config) break

        try {
          const now = new Date()
          const periodEnd = new Date(now)
          periodEnd.setMonth(periodEnd.getMonth() + 1)

          // 更新订阅周期
          await supabaseAdmin
            .from('subscriptions')
            .update({
              status: 'active',
              current_credits: config.credits,
              current_period_start: now.toISOString(),
              current_period_end: periodEnd.toISOString(),
            })
            .eq('paypal_subscription_id', subId)

          // 新周期开始：先清零旧订阅积分，再发放新月积分
          const { data: oldBalances } = await supabaseAdmin
            .rpc('get_user_balance_split', { p_user_id: sub.user_id })

          const oldBal = Array.isArray(oldBalances) ? oldBalances[0] : oldBalances
          const oldSubscriptionBalance = oldBal?.subscription_balance || 0
          const oldTotalBalance = oldBal?.total_balance || 0

          if (oldSubscriptionBalance > 0) {
            const totalAfterClear = oldTotalBalance - oldSubscriptionBalance

            // 写入清零流水
            await supabaseAdmin.from('credit_transactions').insert({
              user_id: sub.user_id,
              amount: -oldSubscriptionBalance,
              balance_after: totalAfterClear,
              type: 'subscription_expire',
              credit_source: 'subscription',
              description: `订阅周期结束，清零 ${oldSubscriptionBalance} 剩余订阅积分`,
            })

            // 更新 subscription_balance 为 0
            await supabaseAdmin
              .from('credit_accounts')
              .update({
                subscription_balance: 0,
                balance: totalAfterClear,
                updated_at: new Date().toISOString(),
              })
              .eq('user_id', sub.user_id)
          }

          // 月积分到账（不过期）→ subscription_balance
          await addCredits(
            sub.user_id,
            config.credits,
            'subscription',
            `${config.name} 月度积分续费 (${config.credits}积分)`,
            { planId: sub.plan_id, creditSource: 'subscription' }
          )

          console.log(`Subscription renewed: userId=${sub.user_id}, plan=${sub.plan_id}, credits=${config.credits}`)
        } catch (err) {
          console.error('Failed to renew subscription:', err)
        }
        break
      }

      case 'BILLING.SUBSCRIPTION.CANCELLED': {
        // 月订阅取消（保留积分到月底）
        const subId = body.resource?.id

        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'cancelled',
            cancelled_at: new Date().toISOString(),
          })
          .eq('paypal_subscription_id', subId)

        console.log('Subscription cancelled:', subId)
        break
      }

      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
