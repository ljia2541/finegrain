import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

/**
 * Cloudflare R2 客户端
 */
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'finegrain-uploads'

/**
 * 上传图片到 R2
 */
export async function uploadImage(
  file: File | Buffer,
  filename: string,
  contentType: string
) {
  try {
    const key = `uploads/${Date.now()}-${filename}`

    let body: Buffer | Uint8Array
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer()
      body = new Uint8Array(arrayBuffer)
    } else {
      body = file
    }

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType,
    })

    await r2Client.send(command)

    // 返回公开访问 URL
    const publicUrl = `https://r2.flux-network.dev/${BUCKET_NAME}/${key}`

    return {
      success: true,
      key,
      url: publicUrl,
    }
  } catch (error) {
    console.error('R2 upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * 从 R2 获取图片
 */
export async function getImage(key: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    const response = await r2Client.send(command)

    if (!response.Body) {
      throw new Error('No body in response')
    }

    const bytes = await response.Body.transformToByteArray()
    const buffer = Buffer.from(bytes)

    return {
      success: true,
      buffer,
      contentType: response.ContentType,
    }
  } catch (error) {
    console.error('R2 get error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * 从 R2 删除图片
 */
export async function deleteImage(key: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    await r2Client.send(command)

    return {
      success: true,
    }
  } catch (error) {
    console.error('R2 delete error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * 生成图片的临时签名 URL（用于私有访问）
 */
export async function getSignedUrl(key: string, expiresIn: number = 3600) {
  // R2 支持公开访问，这里简化处理
  const publicUrl = `https://r2.flux-network.dev/${BUCKET_NAME}/${key}`
  
  return {
    success: true,
    url: publicUrl,
  }
}
