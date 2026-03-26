import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
})

/**
 * 支持的模型类型
 */
export type ModelType = 'crystal' | 'realesrgan'

/**
 * 放大倍率选项
 */
export type ScaleOption = 2 | 4 | 6 | 8 | 10

/**
 * 图片增强接口
 */
export interface EnhanceOptions {
  image: string // 图片 URL 或 base64
  model?: ModelType // 模型选择
  scale?: ScaleOption // 放大倍率
}

/**
 * 调用 Replicate API 进行图片增强（同步，等待完成）
 */
export async function enhanceImage(options: EnhanceOptions) {
  const {
    image,
    model = 'crystal',
    scale = 4,
  } = options

  try {
    let modelVersion: string
    let input: any

    if (model === 'crystal') {
      // Crystal Upscaler: 专为肖像/面部优化，支持 1-100x 放大
      // 模型会自动选择最优版本
      modelVersion = 'philz1337x/crystal-upscaler'
      input = {
        image,
        scale_factor: scale,
      }
    } else if (model === 'realesrgan') {
      // Real-ESRGAN: 通用图片放大，使用 nightmareai 版本（维护更活跃）
      modelVersion = 'nightmareai/real-esrgan'
      input = {
        image,
        scale,
        face_enhance: false,
      }
    } else {
      throw new Error(`Unknown model: ${model}`)
    }

    // 调用 Replicate API（同步等待）
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    model = 'crystal',
    scale = 4,
  } = options

  try {
    let modelVersion: string
    let input: any

    if (model === 'crystal') {
      modelVersion = 'philz1337x/crystal-upscaler'
      input = {
        image,
        scale_factor: scale,
      }
    } else if (model === 'realesrgan') {
      modelVersion = 'nightmareai/real-esrgan'
      input = {
        image,
        scale,
        face_enhance: false,
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
