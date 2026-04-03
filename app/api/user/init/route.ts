import { NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth'
import { initUser, getUserBalance, getCreditAccount } from '@/lib/supabase'

export const runtime = 'nodejs'

/**
 * POST /api/user/init
 * 首次登录初始化用户（或更新 last_login_at）
 * 注意：JWT callback 里已经自动调用了 initUser
 * 这个接口作为前端手动触发/同步的备用入口
 */
export async function POST() {
  try {
    const session = await getAuthSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await initUser(
      session.user.id,
      session.user.email || '',
      session.user.name || undefined,
      session.user.image || undefined,
    )

    const [balance, account] = await Promise.all([
      getUserBalance(session.user.id),
      getCreditAccount(session.user.id),
    ])

    return NextResponse.json({
      success: true,
      user,
      credits: balance,
      isNewUser: !account, // 积分账户不存在说明是新用户
    })
  } catch (error: any) {
    console.error('Init user error:', error)
    return NextResponse.json({ error: 'Failed to initialize user' }, { status: 500 })
  }
}
