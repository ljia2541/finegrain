import { NextRequest, NextResponse } from 'next/server'
import { captureOrder, PAYPAL_PLANS } from '@/lib/paypal'
import { getAuthSession } from '@/lib/auth'
import { addCredits, initUser } from '@/lib/supabase'

export const runtime = 'nodejs'

/**
 * POST /api/payment/capture
 * 捕获（确认）PayPal 支付，成功后自动加积分
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

      if (!customId) {
        console.error('Missing custom_id in PayPal capture response')
        return NextResponse.json({
          success: true,
          status: capture.status,
          orderId: capture.id,
          creditsAdded: false,
          message: '支付成功但无法识别订单信息',
        })
      }

      let planType: string, planId: string, userId: string
      try {
        ({ planType, planId, userId } = JSON.parse(customId))
      } catch {
        console.error('Invalid custom_id format:', customId)
        return NextResponse.json({
          success: true,
          status: capture.status,
          orderId: capture.id,
          creditsAdded: false,
        })
      }

      let creditsAdded = 0
      let description = ''

      try {
        // 积分包：加积分
        if (planType === 'credits') {
          const plan = PAYPAL_PLANS.credits[planId as keyof typeof PAYPAL_PLANS.credits]
          if (plan) {
            // 确保用户已初始化（兜底）
            const session = await getAuthSession()
            const uid = userId || session?.user?.id
            if (!uid) {
              console.error('No userId in capture')
              return NextResponse.json({
                success: true,
                status: capture.status,
                orderId: capture.id,
                creditsAdded: false,
                message: '支付成功但用户未登录，积分将在下次登录时到账',
              })
            }

            await initUser(uid, '', undefined, undefined) // 确保用户存在

            const expiresAt = new Date()
            expiresAt.setDate(expiresAt.getDate() + plan.validityDays)

            creditsAdded = await addCredits(
              uid,
              plan.credits,
              'purchase',
              `购买 ${plan.credits} 积分包 ($${plan.price})`,
              {
                planId,
                orderId,
                expiresAt: expiresAt.toISOString(),
              }
            )
            description = `${plan.credits} 积分已到账`
          }
        } else if (planType === 'crystal10x') {
          // Crystal 10x 不走积分，记录即可
          description = 'Crystal 10x 单次增强已激活'
        }
      } catch (creditError: any) {
        console.error('Failed to add credits:', creditError)
        // 支付已成功，积分添加失败需要人工处理
        return NextResponse.json({
          success: true,
          status: capture.status,
          orderId: capture.id,
          creditsAdded: false,
          message: '支付成功但积分到账失败，请联系客服并提供订单号',
        })
      }

      return NextResponse.json({
        success: true,
        status: capture.status,
        orderId: capture.id,
        amount,
        planType,
        planId,
        creditsAdded,
        description,
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
