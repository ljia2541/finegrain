import { NextRequest, NextResponse } from 'next/server'
import { generatePresignedUploadUrl, generatePresignedDownloadUrl } from '@/lib/r2'

export const runtime = 'nodejs'

/**
 * POST /api/presign
 * 生成 R2 预签名上传 URL
 * 前端直接 PUT 上传到 R2，彻底绕过 Vercel 4.5MB 限制
 */
export async function POST(request: NextRequest) {
  try {
    const { filename, contentType } = await request.json()

    if (!filename || !contentType) {
      return NextResponse.json({ error: 'filename and contentType are required' }, { status: 400 })
    }

    // 生成唯一文件名
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const ext = filename.split('.').pop() || 'jpg'
    const key = `uploads/${timestamp}-${random}.${ext}`
    const imageId = `${timestamp}-${random}`

    // 生成预签名上传 URL（15 分钟有效）
    const uploadUrl = await generatePresignedUploadUrl(key, contentType, 900)

    // 生成预签名下载 URL（2 小时有效，给 Replicate 读取）
    const downloadUrl = await generatePresignedDownloadUrl(key, 7200)

    return NextResponse.json({
      success: true,
      imageId,
      uploadUrl,
      downloadUrl,
      r2Key: key,
    })
  } catch (error) {
    console.error('Presign error:', error)
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 })
  }
}
