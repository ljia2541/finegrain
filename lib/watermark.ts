import sharp from 'sharp'

/**
 * 给图片添加 FineGrain 水印
 * 右下角半透明白色文字 + 网址
 * 
 * @param inputBuffer 原始图片 Buffer
 * @returns 带水印的图片 Buffer
 */
export async function addWatermark(inputBuffer: Buffer): Promise<Buffer> {
  const metadata = await sharp(inputBuffer).metadata()
  const width = metadata.width || 800
  const height = metadata.height || 600

  // 根据图片尺寸动态调整水印大小
  const fontSize = Math.max(16, Math.min(36, Math.round(width / 25)))
  const padding = Math.round(fontSize * 1.5)

  // SVG 水印
  const svgWatermark = `
    <svg width="${width}" height="${height}">
      <defs>
        <linearGradient id="wmGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:rgba(255,255,255,0.6)" />
          <stop offset="100%" style="stop-color:rgba(255,255,255,0.3)" />
        </linearGradient>
      </defs>
      <text
        x="${width - padding}"
        y="${height - padding * 0.6}"
        text-anchor="end"
        font-family="Arial, Helvetica, sans-serif"
        font-size="${fontSize}"
        font-weight="bold"
        fill="url(#wmGrad)"
      >FineGrain</text>
      <text
        x="${width - padding}"
        y="${height - padding * 0.6 + fontSize * 1.2}"
        text-anchor="end"
        font-family="Arial, Helvetica, sans-serif"
        font-size="${Math.round(fontSize * 0.65)}"
        fill="rgba(255,255,255,0.4)"
      >finegrainimageenhancer.com</text>
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
