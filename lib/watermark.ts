import sharp from 'sharp'
import { WATERMARK_PNG_BASE64 } from './watermark-png'

// 预解析水印 PNG buffer（模块加载时只解析一次）
let watermarkPngBuffer: Buffer | null = null
function getWatermarkBuffer(): Buffer {
  if (!watermarkPngBuffer) {
    watermarkPngBuffer = Buffer.from(WATERMARK_PNG_BASE64, 'base64')
  }
  return watermarkPngBuffer
}

/**
 * 给图片添加 FineGrain 水印
 * 底部居中，使用内嵌的预生成 PNG（不依赖服务器字体或文件系统）
 *
 * @param inputBuffer 原始图片 Buffer
 * @returns 带水印的图片 Buffer
 */
export async function addWatermark(inputBuffer: Buffer): Promise<Buffer> {
  const metadata = await sharp(inputBuffer).metadata()
  const width = metadata.width || 800
  const height = metadata.height || 600

  // 读取预生成的水印并缩放到目标宽度
  const watermarkBarHeight = Math.max(80, Math.round(height * 0.08))
  const watermarkBuf = await sharp(getWatermarkBuffer())
    .resize(width, watermarkBarHeight, { fit: 'fill' })
    .png()
    .toBuffer()

  // composite 到图片底部
  return sharp(inputBuffer)
    .composite([
      {
        input: watermarkBuf,
        top: height - watermarkBarHeight,
        left: 0,
      },
    ])
    .png()
    .toBuffer()
}

/**
 * 判断是否需要添加水印（免费增强需要）
 */
export function needsWatermark(billing: any): boolean {
  return billing?.type === 'free'
}
