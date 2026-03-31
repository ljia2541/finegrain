import { NextRequest, NextResponse } from 'next/server'
import COS from 'cos-nodejs-sdk-v5'

export const runtime = 'nodejs'

const cos = new COS({
  SecretId: process.env.TENCENT_COS_SECRET_ID || '',
  SecretKey: process.env.TENCENT_COS_SECRET_KEY || '',
})

const BUCKET = process.env.TENCENT_COS_BUCKET || ''
const REGION = process.env.TENCENT_COS_REGION || 'na-siliconvalley'

/**
 * 生成 COS 预签名上传 URL
 * 前端直接 PUT 上传到 COS，彻底绕过 Vercel 4.5MB 限制
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
    const presignedUrl = cos.getObjectUrl({
      Bucket: BUCKET,
      Region: REGION,
      Key: key,
      Method: 'PUT',
      Sign: true,
      Expires: 900,
      Headers: {
        'Content-Type': contentType,
      },
    })

    // 生成预签名下载 URL（2 小时有效，给 Replicate 读取）
    const downloadUrl = cos.getObjectUrl({
      Bucket: BUCKET,
      Region: REGION,
      Key: key,
      Sign: true,
      Expires: 7200,
    })

    return NextResponse.json({
      success: true,
      imageId,
      uploadUrl: presignedUrl,
      downloadUrl,
      cosKey: key,
    })
  } catch (error) {
    console.error('Presign error:', error)
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 })
  }
}
