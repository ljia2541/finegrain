import sharp from 'sharp'
import { ROBOTO_BOLD_BASE64 } from './watermark-font'

/**
 * 给图片添加 FineGrain 水印
 * 底部居中，使用内嵌 base64 字体确保跨平台一致性（Vercel 无 Arial/Helvetica）
 *
 * @param inputBuffer 原始图片 Buffer
 * @returns 带水印的图片 Buffer
 */
export async function addWatermark(inputBuffer: Buffer): Promise<Buffer> {
  const metadata = await sharp(inputBuffer).metadata()
  const width = metadata.width || 800
  const height = metadata.height || 600

  // 根据图片尺寸动态调整水印大小
  const fontSize = Math.max(20, Math.min(48, Math.round(width / 20)))
  const smallFontSize = Math.round(fontSize * 0.6)
  const padding = Math.round(fontSize * 1.2)

  // 底部半透明黑色背景条
  const barHeight = fontSize * 2 + padding * 1.2
  const barY = height - barHeight

  // 内嵌 Roboto Bold 子集字体，不依赖系统字体
  const svgWatermark = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          @font-face {
            font-family: 'WatermarkFont';
            src: url(data:font/truetype;base64,${ROBOTO_BOLD_BASE64}) format('truetype');
            font-weight: bold;
          }
        </style>
      </defs>
      <!-- 底部半透明背景条 -->
      <rect x="0" y="${barY}" width="${width}" height="${barHeight}" fill="rgba(0,0,0,0.45)" />

      <!-- FineGrain 文字 -->
      <text
        x="${width / 2}"
        y="${barY + padding + fontSize * 0.85}"
        text-anchor="middle"
        font-family="WatermarkFont"
        font-size="${fontSize}"
        font-weight="bold"
        fill="rgba(255,255,255,0.95)"
        letter-spacing="2"
      >FineGrain</text>

      <!-- 副标题 -->
      <text
        x="${width / 2}"
        y="${barY + padding + fontSize * 0.85 + smallFontSize * 1.5}"
        text-anchor="middle"
        font-family="WatermarkFont"
        font-size="${smallFontSize}"
        fill="rgba(255,255,255,0.7)"
      >Free Preview · finegrainimageenhancer.com</text>
    </svg>
  `

  return sharp(inputBuffer)
    .composite([
      {
        input: Buffer.from(svgWatermark),
        top: 0,
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
