import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id || null
  const targetUserId = userId || 'anonymous'

  const { supabaseAdmin } = await import('@/lib/supabase')
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data: todayCount } = await supabaseAdmin
    .from('enhancement_history')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', targetUserId)
    .gte('created_at', today.toISOString())
    .eq('status', 'completed')

  const used = todayCount?.length || 0
  const limit = 3
  const remaining = Math.max(0, limit - used)

  return NextResponse.json({
    used,
    limit,
    remaining,
    isAnonymous: !userId,
  })
}
