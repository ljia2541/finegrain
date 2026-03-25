import { NextRequest, NextResponse } from 'next/server'
import { getTaskStatus } from '@/lib/replicate'

export const runtime = 'nodejs'

/**
 * GET /api/task/[id]
 * 查询任务状态
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }

    const result = await getTaskStatus(taskId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to get task status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      taskId,
      status: result.status,
      output: result.output,
      error: result.error,
    })
  } catch (error) {
    console.error('Get task error:', error)
    return NextResponse.json(
      { error: 'Failed to get task status' },
      { status: 500 }
    )
  }
}
