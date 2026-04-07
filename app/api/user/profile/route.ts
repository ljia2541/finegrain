import { NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth'
import { getUserStats, getTransactions, initUser } from '@/lib/supabase'

export const runtime = 'nodejs'

/**
 * GET /api/user/profile
 * 获取用户个人中心数据
 */
export async function GET() {
  try {
    const session = await getAuthSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 确保用户已初始化（兜底）
    try {
      await initUser(
        session.user.id,
        session.user.email || '',
        session.user.name || undefined,
        session.user.image || undefined,
      )
    } catch (e) {
      // 初始化失败不阻塞 profile 查询
      console.warn('Profile init warning:', e)
    }

    const [stats, { transactions }] = await Promise.all([
      getUserStats(session.user.id),
      getTransactions(session.user.id, { limit: 10 }),
    ])

    let creditsExpireAt: string | null = null
    try {
      creditsExpireAt = await getUserEarliestExpiry(session.user.id)
    } catch {}

    // 获取订阅状态
    let subscription = null
    try {
      const { supabaseAdmin } = await import('@/lib/supabase')
      const { data: subs, error: subError } = await supabaseAdmin
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('status', 'active')
        .order('started_at', { ascending: false })
        .limit(1)

      console.log('[DEBUG] subscription query:', { userId: session.user.id, subs, subError })

      if (subs && subs.length > 0) {
        const sub = subs[0]
        subscription = {
          planId: sub.plan_id,
          planName: sub.plan_id.charAt(0).toUpperCase() + sub.plan_id.slice(1),
          creditsPerMonth: sub.credits_per_month,
          currentCredits: sub.current_credits,
          periodEnd: sub.current_period_end,
        }
      }
    } catch (e) {
      console.error('[DEBUG] subscription query error:', e)
    }

    return NextResponse.json({
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        avatar: session.user.image,
      },
      stats: {
        credits: stats.credits,
        totalProcessed: stats.totalProcessed,
        totalPurchased: stats.totalPurchased,
        totalSpent: stats.totalSpent,
        creditsExpireAt,
      },
      subscription,
      recentTransactions: transactions.map(tx => ({
        id: tx.id,
        type: tx.type,
        amount: tx.amount,
        balanceAfter: tx.balance_after,
        description: tx.description,
        model: tx.model,
        createdAt: tx.created_at,
      })),
    })
  } catch (error: any) {
    console.error('Get profile error:', error)
    return NextResponse.json({ error: 'Failed to get profile' }, { status: 500 })
  }
}
