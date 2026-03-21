import { NextRequest, NextResponse } from 'next/server'
import { enhanceImageAsync } from '@/lib/replicate'

/**
 * POST /api/enhance
 * 调用 Replicate API 增强图片
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageId, imageUrl, model = 'realesrgan', scale = 2 } = body

    if (!imageUrl && !imageId) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    // 调用增强 API
    const result = await enhanceImageAsync({
      image: imageUrl,
      model,
      scale,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    // 返回任务信息
    return NextResponse.json({
      success: true,
      taskId: result.taskId,
      status: result.status,
      model: result.model,
      scale: result.scale,
      estimatedTime: model === 'hat' ? 60 : 10, // HAT 需要更长时间
    })
  } catch (error) {
    console.error('Enhance API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
