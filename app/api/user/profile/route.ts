import { NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth'

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

    // TODO: 接入 Supabase
    // const stats = await getUserStats(session.user.id)
    // const { transactions } = await getTransactions(session.user.id, { limit: 5 })

    return NextResponse.json({
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        avatar: session.user.image,
      },
      stats: {
        credits: 0,
        totalProcessed: 0,
        totalPurchased: 0,
        totalSpent: 0,
        subscription: null,
      },
      recentTransactions: [],
    })
  } catch (error: any) {
    console.error('Get profile error:', error)
    return NextResponse.json({ error: 'Failed to get profile' }, { status: 500 })
  }
}
