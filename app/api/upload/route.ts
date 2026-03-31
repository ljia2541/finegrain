import { NextRequest, NextResponse } from 'next/server'
import { uploadToCos, getSignedUrl } from '@/lib/cos'

export const runtime = 'nodejs'

/**
 * POST /api/upload
 * 上传图片到 COS，返回签名 URL
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

    // 上传到 COS
    const { key } = await uploadToCos(buffer, filename, file.type)

    // 返回签名 URL（2小时有效，足够 Replicate 处理 + 用户下载）
    const signedUrl = getSignedUrl(key, 7200)

    return NextResponse.json({
      success: true,
      imageId: `${timestamp}-${random}`,
      imageUrl: signedUrl,
      cosKey: key,
      filename,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error('Upload error:', error)
    const msg = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: `Upload failed: ${msg}` },
      { status: 500 }
    )
  }
}
