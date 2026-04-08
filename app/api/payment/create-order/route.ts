import { NextRequest, NextResponse } from 'next/server'
import { createOrder, PAYPAL_PLANS, SUBSCRIPTION_CONFIG } from '@/lib/paypal'
import { getAuthSession } from '@/lib/auth'

export const runtime = 'nodejs'

/**
 * POST /api/payment/create-order
 * 创建 PayPal 订单（一次性支付：积分包）
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { planType, planId } = body

    if (!planType || !planId) {
      return NextResponse.json({ error: 'planType and planId are required' }, { status: 400 })
    }

    // 月订阅暂不支持
    if (planType === 'subscription') {
      return NextResponse.json(
        { error: '月订阅功能即将上线，请先使用积分包' },
        { status: 503 }
      )
    }

    // 积分包需要登录
    let userId: string | undefined
    if (planType === 'credits') {
      const session = await getAuthSession()
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'LOGIN_REQUIRED' }, { status: 401 })
      }
      userId = session.user.id
    }

    const result = await createOrder('credits', planId, userId)
    return NextResponse.json({ success: true, ...result })
  } catch (error: any) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/payment/plans
 * 获取所有支付计划
 */
export async function GET() {
  return NextResponse.json({
    credits: Object.entries(PAYPAL_PLANS.credits).map(([id, plan]) => ({
      id,
      ...plan,
    })),
    subscriptions: Object.entries(SUBSCRIPTION_CONFIG).map(([id, plan]) => ({
      id,
      ...plan,
    })),
  })
}
