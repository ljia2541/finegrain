import { NextRequest, NextResponse } from 'next/server'
import { uploadBuffer, generatePresignedDownloadUrl } from '@/lib/r2'

export const runtime = 'nodejs'

/**
 * POST /api/upload
 * 上传图片到 R2，返回签名 URL
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/avif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Supported: JPG, PNG, WebP, HEIC, AVIF' },
        { status: 400 }
      )
    }

    // 验证文件大小 (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB' },
        { status: 400 }
      )
    }

    // 读取文件内容
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 生成唯一文件名
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `${timestamp}-${random}.${ext}`
    const key = `uploads/${filename}`

    // 上传到 R2
    await uploadBuffer(buffer, key, file.type)

    // 返回签名 URL（2小时有效，足够 Replicate 处理 + 用户下载）
    const signedUrl = await generatePresignedDownloadUrl(key, 7200)

    return NextResponse.json({
      success: true,
      imageId: `${timestamp}-${random}`,
      imageUrl: signedUrl,
      r2Key: key,
      filename,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error('Upload error:', error)
    let msg = 'Unknown error'
    if (error instanceof Error) {
      msg = error.message
    } else if (typeof error === 'object' && error !== null) {
      msg = JSON.stringify(error)
    } else {
      msg = String(error)
    }
    return NextResponse.json(
      { error: `Upload failed: ${msg}` },
      { status: 500 }
    )
  }
}
