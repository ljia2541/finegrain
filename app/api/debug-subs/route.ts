import { NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth'

export const runtime = 'nodejs'

export async function GET() {
  const session = await getAuthSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 })
  }

  const userId = session.user.id
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  return NextResponse.json({
    userId,
    hasServiceKey: !!serviceKey,
    serviceKeyPrefix: serviceKey ? serviceKey.slice(0, 15) + '...' : 'MISSING',
    supabaseUrl,
  })
}
