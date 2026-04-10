import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const { count: totalCount, error: err1 } = await supabaseAdmin
    .from('enhancement_history')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', 'anonymous')
    .eq('status', 'completed')
  
  const { count: todayCount, error: err2 } = await supabaseAdmin
    .from('enhancement_history')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', 'anonymous')
    .gte('created_at', today.toISOString())
    .eq('status', 'completed')
  
  return NextResponse.json({
    serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET',
    totalAnonymousRecords: totalCount,
    todayAnonymousRecords: todayCount,
    errors: [err1?.message, err2?.message],
  })
}
