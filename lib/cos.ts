import COS from 'cos-nodejs-sdk-v5'

const cos = new COS({
  SecretId: process.env.TENCENT_COS_SECRET_ID || '',
  SecretKey: process.env.TENCENT_COS_SECRET_KEY || '',
})

const BUCKET = process.env.TENCENT_COS_BUCKET || ''
const REGION = process.env.TENCENT_COS_REGION || 'na-siliconvalley'

/**
 * 上传文件到 COS
 */
export async function uploadToCos(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<{ key: string; url: string }> {
  const key = `uploads/${filename}`

  return new Promise((resolve, reject) => {
    cos.putObject(
      {
        Bucket: BUCKET,
        Region: REGION,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      },
      (err, data) => {
        if (err) return reject(err)
        resolve({
          key,
          url: `https://${BUCKET}.cos.${REGION}.myqcloud.com/${key}`,
        })
      }
    )
  })
}

/**
 * 获取签名 URL（用于 Replicate 读取 + 用户下载结果图）
 */
export function getSignedUrl(key: string, expires: number = 3600): string {
  return cos.getObjectUrl({
    Bucket: BUCKET,
    Region: REGION,
    Key: key,
    Sign: true,
    Expires: expires,
  })
}

/**
 * 删除 COS 文件
 */
export async function deleteFromCos(key: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cos.deleteObject(
      {
        Bucket: BUCKET,
        Region: REGION,
        Key: key,
      },
      (err) => {
        if (err) return reject(err)
        resolve()
      }
    )
  })
}
