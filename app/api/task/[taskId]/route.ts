import { NextRequest, NextResponse } from 'next/server'
import { getTaskStatus } from '@/lib/replicate'

/**
 * GET /api/task/[taskId]
 * 查询任务状态
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const { taskId } = params

    // 查询任务状态
    const result = await getTaskStatus(taskId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    // 返回任务状态
    return NextResponse.json({
      success: true,
      taskId,
      status: result.status,
      imageUrl: result.output || null,
      error: result.error || null,
    })
  } catch (error) {
    console.error('Task status API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
