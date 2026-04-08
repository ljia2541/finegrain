import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { deleteFromCos } from '@/lib/cos'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// This endpoint should be called by a cron job daily
// e.g., via Vercel Cron, GitHub Actions, or external scheduler
export async function POST(request: Request) {
  // Optional: verify cron secret
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Find records older than 24 hours
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    
    const { data: oldRecords, error } = await supabase
      .from('enhancement_history')
      .select('id, input_url, output_url')
      .eq('status', 'completed')
      .lt('created_at', cutoffTime)

    if (error) {
      console.error('Error fetching old records:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    let deletedCount = 0
    let cosDeleteCount = 0
    const errors: string[] = []

    for (const record of oldRecords || []) {
      // Delete from COS
      try {
        if (record.input_url) {
          const inputKey = record.input_url.split('/').pop()
          if (inputKey) await deleteFromCos(`uploads/${inputKey}`)
          cosDeleteCount++
        }
        if (record.output_url) {
          const outputKey = record.output_url.split('/').pop()
          if (outputKey) await deleteFromCos(`outputs/${outputKey}`)
          cosDeleteCount++
        }
      } catch (e: any) {
        errors.push(`COS delete error for record ${record.id}: ${e.message}`)
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from('enhancement_history')
        .delete()
        .eq('id', record.id)

      if (deleteError) {
        errors.push(`DB delete error for record ${record.id}: ${deleteError.message}`)
      } else {
        deletedCount++
      }
    }

    return NextResponse.json({
      success: true,
      deletedRecords: deletedCount,
      deletedCosFiles: cosDeleteCount,
      cutoffTime,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (e: any) {
    console.error('Cleanup error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// Also support GET for easy testing
export async function GET() {
  const req = new Request('http://localhost/api/cron/cleanup-history', {
    method: 'POST',
    headers: { 'authorization': `Bearer ${process.env.CRON_SECRET || ''}` }
  })
  return POST(req)
}
