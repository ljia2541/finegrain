import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/upload
 * 上传图片（使用 base64 编码，直接存储到 Replicate）
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // 验证文件类型
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/avif']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, WebP, HEIC, and AVIF are supported.' },
        { status: 400 }
      )
    }

    // 验证文件大小（10MB）
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // 转换为 base64（直接传给 Replicate）
    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    // 生成图片 ID
    const imageId = `${Date.now()}-${Math.random().toString(36).substring(7)}`

    // 返回图片信息（使用 base64 data URL）
    return NextResponse.json({
      success: true,
      imageUrl: dataUrl,
      imageId,
      size: file.size,
      type: file.type,
      note: 'Image is converted to base64 for Replicate processing',
    })
  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
