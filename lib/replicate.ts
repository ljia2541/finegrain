import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
})

/**
 * 支持的模型类型
 */
export type ModelType = 'realesrgan' | 'recraft' | 'google'

/**
 * 放大倍率选项
 */
export type ScaleOption = 2 | 4 | 6 | 8

/**
 * Google Upscaler 积分消耗
 */
export const GOOGLE_UPSCALER_CREDITS = 4

/**
 * 图片增强接口
 */
export interface EnhanceOptions {
  image: string // 图片 URL 或 base64
  model?: ModelType // 模型选择
  scale?: ScaleOption // 放大倍率
  faceEnhance?: boolean // Real-ESRGAN 人脸增强（默认 false）
}

/**
 * 模型配置
 */
export const MODEL_CONFIG = {
  realesrgan: {
    id: 'nightmareai/real-esrgan',
    displayName: 'Real-ESRGAN',
    supportsScale: true as const,
    maxLongEdge: 1440, // Replicate 建议最大 1440p 输入
    credits: { 2: 2, 4: 2, 6: 2, 8: 2 },
  },
  recraft: {
    id: 'recraft-ai/recraft-crisp-upscale',
    displayName: 'Recraft',
    supportsScale: false as const, // 无倍率参数，模型自动决定
    maxLongEdge: null, // 无明确限制（10MB 文件大小限制）
    credits: { 2: 6, 4: 6, 6: 6, 8: 6 },
  },
  google: {
    id: 'google/upscaler',
    displayName: 'Google Upscaler',
    supportsScale: true as const,
    maxLongEdge: null, // 10MB 文件大小限制
    credits: { 2: GOOGLE_UPSCALER_CREDITS, 4: GOOGLE_UPSCALER_CREDITS },
    supportedScales: [2, 4] as const, // 仅支持 2x 和 4x
  },
} as const

/**
 * 调用 Replicate API 进行图片增强（同步，等待完成）
 */
export async function enhanceImage(options: EnhanceOptions) {
  const {
    image,
    model = 'realesrgan',
    scale = 4,
    faceEnhance = false,
  } = options

  try {
    let modelVersion: string
    let input: Record<string, unknown>

    if (model === 'realesrgan') {
      modelVersion = MODEL_CONFIG.realesrgan.id
      input = {
        image,
        scale,
        face_enhance: faceEnhance,
      }
    } else if (model === 'recraft') {
      modelVersion = MODEL_CONFIG.recraft.id
      input = {
        image,
        // Recraft 无其他参数
      }
    } else if (model === 'google') {
      modelVersion = MODEL_CONFIG.google.id
      input = {
        image,
        upscale_factor: scale === 2 ? 'x2' : 'x4',
        compression_quality: 100,
      }
    } else {
      throw new Error(`Unknown model: ${model}`)
    }

    // 调用 Replicate API（同步等待）
    const output = await replicate.run(modelVersion as any, {
      input,
    })

    // 返回结果 - output 可能是字符串或字符串数组
    const imageUrl = Array.isArray(output) ? output[0] : output

    return {
      success: true,
      imageUrl: imageUrl as string,
      model,
      scale,
    }
  } catch (error) {
    console.error('Replicate API error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * 异步图片增强（返回任务 ID，适用于长时间任务）
 */
export async function enhanceImageAsync(options: EnhanceOptions) {
  const {
    image,
    model = 'realesrgan',
    scale = 4,
    faceEnhance = false,
  } = options

  try {
    let modelVersion: string
    let input: Record<string, unknown>

    if (model === 'realesrgan') {
      modelVersion = MODEL_CONFIG.realesrgan.id
      input = {
        image,
        scale,
        face_enhance: faceEnhance,
      }
    } else if (model === 'recraft') {
      modelVersion = MODEL_CONFIG.recraft.id
      input = {
        image,
      }
    } else if (model === 'google') {
      modelVersion = MODEL_CONFIG.google.id
      input = {
        image,
        upscale_factor: scale === 2 ? 'x2' : 'x4',
        compression_quality: 100,
      }
    } else {
      throw new Error(`Unknown model: ${model}`)
    }

    // 创建异步任务
    const prediction = await replicate.predictions.create({
      version: modelVersion,
      input,
    })

    return {
      success: true,
      taskId: prediction.id,
      status: prediction.status,
      model,
      scale,
    }
  } catch (error) {
    console.error('Replicate API error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * 查询任务状态
 */
export async function getTaskStatus(taskId: string) {
  try {
    const prediction = await replicate.predictions.get(taskId)

    return {
      success: true,
      status: prediction.status,
      output: prediction.output,
      error: prediction.error,
    }
  } catch (error) {
    console.error('Get task status error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * 取消任务
 */
export async function cancelTask(taskId: string) {
  try {
    await replicate.predictions.cancel(taskId)
    return { success: true }
  } catch (error) {
    console.error('Cancel task error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
