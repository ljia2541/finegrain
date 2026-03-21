import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/r2'

/**
 * POST /api/upload
 * 上传图片到 R2
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

    // 上传到 R2
    const result = await uploadImage(file, file.name, file.type)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    // 返回图片信息
    return NextResponse.json({
      success: true,
      imageUrl: result.url,
      imageId: result.key,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
