import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
})

/**
 * 图片增强接口
 */
export interface EnhanceOptions {
  image: string // 图片 URL 或 base64
  model?: 'realesrgan' | 'hat' | 'naifnet' // 模型选择
  scale?: 2 | 4 // 放大倍率
  denoiseStrength?: number // 降噪强度 (0-1)
}

/**
 * 调用 Replicate API 进行图片增强
 */
export async function enhanceImage(options: EnhanceOptions) {
  const {
    image,
    model = 'realesrgan',
    scale = 2,
    denoiseStrength = 0.5,
  } = options

  try {
    let modelVersion: string
    let input: any

    if (model === 'realesrgan') {
      // Real-ESRGAN: 快速、稳定
      modelVersion = 'xinntao/realesrgan:v4.0.0'
      input = {
        image,
        scale,
        face_enhance: false,
      }
    } else if (model === 'hat') {
      // HAT: 高质量、细节恢复
      modelVersion = 'ckiplab/hat:latest'
      input = {
        image,
        scale: scale === 4 ? 4 : 2,
        denoise_strength: denoiseStrength,
      }
    } else if (model === 'naifnet') {
      // NAFNet: 降噪优先
      modelVersion = 'junyanz/naifnet:latest'
      input = {
        image,
        task: 'denoise_sr',
        scale: scale === 4 ? 4 : 2,
      }
    } else {
      throw new Error(`Unknown model: ${model}`)
    }

    // 调用 Replicate API
    const output = await replicate.run(modelVersion, {
      input,
    })

    // 返回结果
    return {
      success: true,
      imageUrl: output as string,
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
 * 异步图片增强（返回任务 ID）
 */
export async function enhanceImageAsync(options: EnhanceOptions) {
  const {
    image,
    model = 'realesrgan',
    scale = 2,
    denoiseStrength = 0.5,
  } = options

  try {
    let modelVersion: string
    let input: any

    if (model === 'realesrgan') {
      modelVersion = 'xinntao/realesrgan:v4.0.0'
      input = {
        image,
        scale,
        face_enhance: false,
      }
    } else if (model === 'hat') {
      modelVersion = 'ckiplab/hat:latest'
      input = {
        image,
        scale: scale === 4 ? 4 : 2,
        denoise_strength: denoiseStrength,
      }
    } else if (model === 'naifnet') {
      modelVersion = 'junyanz/naifnet:latest'
      input = {
        image,
        task: 'denoise_sr',
        scale: scale === 4 ? 4 : 2,
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
