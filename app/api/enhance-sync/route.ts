import { NextRequest, NextResponse } from 'next/server'
import { enhanceImage, validateCrystalInput, CRYSTAL_MAX_LONG_EDGE, CRYSTAL_10X_PRICE, CRYSTAL_4X_CREDITS, GOOGLE_UPSCALER_CREDITS } from '@/lib/replicate'

export const runtime = 'nodejs'
// Vercel Hobby plan: max 60s, Pro: max 300s
// Replicate can take 30-120s for some models
export const maxDuration = 300

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageUrl, model = 'realesrgan', scale = 4, imageWidth, imageHeight, faceEnhance = false } = body

    // imageUrl 是 COS 签名 URL
    if (!imageUrl) {
      return NextResponse.json({ error: 'imageUrl is required' }, { status: 400 })
    }

    // 验证模型
    const validModels = ['crystal', 'realesrgan', 'recraft', 'google']
    if (!validModels.includes(model)) {
      return NextResponse.json({ error: `Invalid model: ${model}` }, { status: 400 })
    }

    // Crystal 尺寸校验
    if (model === 'crystal') {
      if (imageWidth && imageHeight) {
        const validation = validateCrystalInput(imageWidth, imageHeight)
        if (!validation.valid) {
          return NextResponse.json({ error: validation.message }, { status: 400 })
        }
      }
    }

    // 倍率校验
    if (model === 'google') {
      if (![2, 4].includes(scale)) {
        return NextResponse.json({ error: 'Google Upscaler only supports 2x and 4x' }, { status: 400 })
      }
    }

    // 调用同步增强（等待完成）— imageUrl 直接传给 Replicate
    const result = await enhanceImage({
      image: imageUrl,
      model,
      scale: model === 'recraft' ? 4 : scale,
      faceEnhance,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Enhancement failed' }, { status: 500 })
    }

    // 计费信息
    let billing = null
    if (model === 'crystal' && scale === 10) {
      billing = { type: 'direct_pay', price: CRYSTAL_10X_PRICE, currency: 'USD' }
    } else if (model === 'crystal') {
      billing = { type: 'credits', credits: CRYSTAL_4X_CREDITS }
    } else if (model === 'recraft') {
      billing = { type: 'credits', credits: 6 }
    } else if (model === 'google') {
      billing = { type: 'credits', credits: GOOGLE_UPSCALER_CREDITS }
    }

    return NextResponse.json({
      success: true,
      imageUrl: result.imageUrl,
      model: result.model,
      scale: result.scale,
      billing,
    })
  } catch (error) {
    console.error('Enhance sync error:', error)
    return NextResponse.json({ error: 'Enhancement failed' }, { status: 500 })
  }
}
