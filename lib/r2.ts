import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl as getPresignedUrl } from '@aws-sdk/s3-request-presigner'

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

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'finegrain'

/**
 * R2 公开访问 URL 前缀
 * 自定义域名生效后用自定义域名，否则用 R2 子域名
 */
function getPublicUrlPrefix(): string {
  return process.env.R2_PUBLIC_URL || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${BUCKET_NAME}`
}

/**
 * 生成预签名上传 URL（前端直接 PUT 上传到 R2）
 */
export async function generatePresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 900
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  })

  const url = await getPresignedUrl(r2Client, command, { expiresIn })
  return url
}

/**
 * 生成预签名下载 URL（给 Replicate 读取 + 内部处理）
 * 禁用 checksum 要求，避免 GET 请求 403
 */
export async function generatePresignedDownloadUrl(
  key: string,
  expiresIn: number = 7200
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    // @ts-ignore - disable checksum to avoid 403 on unsigned GET requests
    ChecksumMode: undefined,
  })

  const url = await getPresignedUrl(r2Client, command, {
    expiresIn,
    // @ts-ignore
    unhoistableHeaders: new Set(['x-amz-checksum-mode']),
  })
  return url
}

/**
 * 上传 Buffer 到 R2（服务端上传）
 */
export async function uploadBuffer(
  buffer: Buffer | Uint8Array,
  key: string,
  contentType: string
): Promise<void> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  })

  await r2Client.send(command)
}

/**
 * 从 R2 获取图片
 */
export async function getObject(key: string) {
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
 * 从 R2 删除文件
 */
export async function deleteObject(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  await r2Client.send(command)
}
