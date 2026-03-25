import { NextRequest, NextResponse } from 'next/server'
import { enhanceImageAsync } from '@/lib/replicate'

export const runtime = 'nodejs'

/**
 * POST /api/enhance
 * 提交图片增强任务
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageUrl, model = 'realesrgan', scale = 2 } = body

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'imageUrl is required' },
        { status: 400 }
      )
    }

    // 验证模型选择
    const validModels = ['realesrgan', 'hat', 'naifnet']
    if (!validModels.includes(model)) {
      return NextResponse.json(
        { error: `Invalid model. Supported: ${validModels.join(', ')}` },
        { status: 400 }
      )
    }

    // 验证放大倍率
    if (![2, 4].includes(scale)) {
      return NextResponse.json(
        { error: 'Invalid scale. Supported: 2, 4' },
        { status: 400 }
      )
    }

    // 调用 Replicate API
    const result = await enhanceImageAsync({
      image: imageUrl,
      model,
      scale,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Enhancement failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      taskId: result.taskId,
      status: result.status,
      model: result.model,
      scale: result.scale,
    })
  } catch (error) {
    console.error('Enhance error:', error)
    return NextResponse.json(
      { error: 'Enhancement request failed' },
      { status: 500 }
    )
  }
}
