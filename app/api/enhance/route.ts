import { NextRequest, NextResponse } from 'next/server'
import { enhanceImageAsync, validateCrystalInput, CRYSTAL_MAX_LONG_EDGE, CRYSTAL_10X_PRICE, CRYSTAL_4X_CREDITS, GOOGLE_UPSCALER_CREDITS } from '@/lib/replicate'

export const runtime = 'nodejs'

/**
 * POST /api/enhance
 * 提交图片增强任务
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageUrl, model = 'crystal', scale = 4, imageWidth, imageHeight, faceEnhance = false } = body

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'imageUrl is required' },
        { status: 400 }
      )
    }

    // 验证模型选择
    const validModels = ['crystal', 'realesrgan', 'recraft', 'google']
    if (!validModels.includes(model)) {
      return NextResponse.json(
        { error: `Invalid model. Supported: ${validModels.join(', ')}` },
        { status: 400 }
      )
    }

    // Crystal 系列输入尺寸校验
    if (model === 'crystal') {
      // 如果前端传了图片尺寸，直接校验
      if (imageWidth && imageHeight) {
        const validation = validateCrystalInput(imageWidth, imageHeight)
        if (!validation.valid) {
          return NextResponse.json(
            { error: validation.message },
            { status: 400 }
          )
        }
      }
    }

    // 验证放大倍率 (2, 4, 6, 8, 10)
    // Recraft 和 Google 不需要 scale 参数（或仅支持 2x/4x）
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
      const validScales = [2, 4, 6, 8, 10]
      if (!validScales.includes(scale)) {
        return NextResponse.json(
          { error: `Invalid scale. Supported: ${validScales.join(', ')}` },
          { status: 400 }
        )
      }
    }

    // Crystal 10x 必须校验输入尺寸（后端兜底）
    if (model === 'crystal' && scale === 10) {
      if (!imageWidth || !imageHeight) {
        return NextResponse.json(
          { error: 'Crystal 10x requires imageWidth and imageHeight for size validation' },
          { status: 400 }
        )
      }
      const validation = validateCrystalInput(imageWidth, imageHeight)
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.message },
          { status: 400 }
        )
      }
    }

    // 调用 Replicate API
    const result = await enhanceImageAsync({
      image: imageUrl,
      model,
      // Recraft only supports 2x, frontend limits selection
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
    if (model === 'crystal') {
      if (scale === 10) {
        billing = { type: 'direct_pay', price: CRYSTAL_10X_PRICE, currency: 'USD' }
      } else {
        billing = { type: 'credits', credits: CRYSTAL_4X_CREDITS }
      }
    } else if (model === 'google') {
      billing = { type: 'credits', credits: GOOGLE_UPSCALER_CREDITS }
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
