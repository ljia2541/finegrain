import { NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth'

export const runtime = 'nodejs'

/**
 * POST /api/user/init
 * 首次登录初始化用户
 */
export async function POST() {
  try {
    const session = await getAuthSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: 接入 Supabase
    // await initUser(
    //   session.user.id,
    //   session.user.email || '',
    //   session.user.name || undefined,
    //   session.user.image || undefined,
    // )

    return NextResponse.json({
      success: true,
      userId: session.user.id,
    })
  } catch (error: any) {
    console.error('Init user error:', error)
    return NextResponse.json({ error: 'Failed to initialize user' }, { status: 500 })
  }
}
