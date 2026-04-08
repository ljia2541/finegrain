import { NextRequest, NextResponse } from 'next/server'
import { enhanceImageAsync, GOOGLE_UPSCALER_CREDITS } from '@/lib/replicate'

export const runtime = 'nodejs'

/**
 * POST /api/enhance
 * 提交图片增强任务
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageUrl, model = 'realesrgan', scale = 4, faceEnhance = false } = body

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'imageUrl is required' },
        { status: 400 }
      )
    }

    // 验证模型选择
    const validModels = ['realesrgan', 'recraft', 'google']
    if (!validModels.includes(model)) {
      return NextResponse.json(
        { error: `Invalid model. Supported: ${validModels.join(', ')}` },
        { status: 400 }
      )
    }

    // 验证放大倍率
    if (model === 'recraft') {
      // Recraft 无 scale 参数，跳过
    } else if (model === 'google') {
      const validScales = [2, 4]
      if (!validScales.includes(scale)) {
        return NextResponse.json(
          { error: `Google Upscaler only supports 2x and 4x. Got: ${scale}x` },
          { status: 400 }
        )
      }
    } else {
      const validScales = [2, 4, 6, 8]
      if (!validScales.includes(scale)) {
        return NextResponse.json(
          { error: `Invalid scale. Supported: ${validScales.join(', ')}` },
          { status: 400 }
        )
      }
    }

    // 调用 Replicate API
    const result = await enhanceImageAsync({
      image: imageUrl,
      model,
      faceEnhance,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Enhancement failed' },
        { status: 500 }
      )
    }

    // 计算计费信息
    let billing = null
    if (model === 'google') {
      billing = { type: 'credits', credits: GOOGLE_UPSCALER_CREDITS }
    } else if (model === 'recraft') {
      billing = { type: 'credits', credits: 6 }
    }

    return NextResponse.json({
      success: true,
      taskId: result.taskId,
      status: result.status,
      model: result.model,
      scale: result.scale,
      billing,
    })
  } catch (error) {
    console.error('Enhance error:', error)
    return NextResponse.json(
      { error: 'Enhancement request failed' },
      { status: 500 }
    )
  }
}
