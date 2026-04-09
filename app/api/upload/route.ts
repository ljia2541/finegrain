import { NextRequest, NextResponse } from 'next/server'
import { uploadBuffer, generatePresignedDownloadUrl } from '@/lib/r2'
import sharp from 'sharp'

export const runtime = 'nodejs'

/**
 * POST /api/upload
 * 上传图片到 R2，返回签名 URL
 * 接收 FormData，避免 CORS 问题（前端直传 R2 会被 CORS 拦截）
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

    // 读取文件内容
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 压缩：如果超过 3MB，用 sharp 缩小质量/尺寸确保 < 4.5MB（Vercel 后端限制）
    let finalBuffer = buffer
    let finalType = file.type
    if (buffer.length > 3 * 1024 * 1024) {
      try {
        const img = sharp(buffer)
        const meta = await img.metadata()
        const totalPixels = (meta.width || 0) * (meta.height || 0)

        // 压缩到 400 万像素 + JPEG 质量 0.85
        const MAX_PIXELS = 4_000_000
        let resizeOpts: any = {}
        if (totalPixels > MAX_PIXELS) {
          const ratio = Math.sqrt(MAX_PIXELS / totalPixels)
          resizeOpts = {
            width: Math.round((meta.width || 0) * ratio),
            height: Math.round((meta.height || 0) * ratio),
            fit: 'inside' as const,
            withoutEnlargement: true,
          }
        }

        finalBuffer = await img
          .resize(resizeOpts)
          .jpeg({ quality: 85 })
          .toBuffer()
        finalType = 'image/jpeg'
      } catch (e) {
        // sharp 处理失败，用原 buffer
      }
    }

    // 生成唯一文件名
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const ext = finalType === 'image/jpeg' ? 'jpg' : (file.name.split('.').pop() || 'jpg')
    const filename = `${timestamp}-${random}.${ext}`
    const key = `uploads/${filename}`

    // 上传到 R2
    await uploadBuffer(finalBuffer, key, finalType)

    // 返回签名 URL（2小时有效）
    const signedUrl = await generatePresignedDownloadUrl(key, 7200)

    return NextResponse.json({
      success: true,
      imageId: `${timestamp}-${random}`,
      imageUrl: signedUrl,
      r2Key: key,
      filename,
      size: finalBuffer.length,
      type: finalType,
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
