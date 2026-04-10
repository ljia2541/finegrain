import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data: todayCount, count, error } = await supabaseAdmin
    .from('enhancement_history')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', 'anonymous')
    .gte('created_at', today.toISOString())
    .eq('status', 'completed')

  return NextResponse.json({
    todayCount,
    count,
    error,
    queryTimestamp: today.toISOString(),
  })
}
