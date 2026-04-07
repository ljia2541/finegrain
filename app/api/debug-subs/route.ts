import { NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function GET() {
  const session = await getAuthSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 })
  }

  const userId = session.user.id

  // Direct query with inline client
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: subs, error: subError } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)

  // Also check all subscriptions regardless of status
  const { data: allSubs, error: allSubError } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)

  return NextResponse.json({
    userId,
    subs,
    subError,
    allSubs,
    allSubError,
  })
}
