/**
 * POST /api/enhance
 * 提交图片增强任务
 */
export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const { imageUrl, model = 'realesrgan', scale = 2, denoiseStrength = 0.5 } = body;

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: 'imageUrl is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证模型选择
    const validModels = ['realesrgan', 'hat', 'naifnet'];
    if (!validModels.includes(model)) {
      return new Response(JSON.stringify({
        error: `Invalid model. Supported: ${validModels.join(', ')}`
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证放大倍率
    if (![2, 4].includes(scale)) {
      return new Response(JSON.stringify({
        error: 'Invalid scale. Supported: 2, 4'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 调用 Replicate API
    const result = await enhanceImageAsync({
      image: imageUrl,
      model,
      scale,
      denoiseStrength,
    }, env);

    if (!result.success) {
      return new Response(JSON.stringify({
        error: result.error || 'Enhancement failed'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      taskId: result.taskId,
      status: result.status,
      model: result.model,
      scale: result.scale,
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Enhance error:', error);
    return new Response(JSON.stringify({ error: 'Enhancement request failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Replicate API 调用函数
async function enhanceImageAsync({ image, model, scale, denoiseStrength }, env) {
  const REPLICATE_API_TOKEN = env.REPLICATE_API_TOKEN;

  if (!REPLICATE_API_TOKEN) {
    return { success: false, error: 'Replicate API token not configured' };
  }

  try {
    // 根据模型选择正确的版本
    let modelVersion, input;

    if (model === 'realesrgan') {
      modelVersion = 'xinntao/realesrgan:v4.0.0';
      input = {
        image: image,
        scale: scale,
        face_enhance: false,
      };
    } else if (model === 'hat') {
      modelVersion = 'ckiplab/hat:latest';
      input = {
        image: image,
        scale: scale === 4 ? 4 : 2,
        denoise_strength: denoiseStrength,
      };
    } else if (model === 'naifnet') {
      modelVersion = 'junyanz/naifnet:latest';
      input = {
        image: image,
        task: 'denoise_sr',
        scale: scale === 4 ? 4 : 2,
      };
    }

    // 创建预测任务
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: modelVersion,
        input: input,
      })
    });

    const data = await response.json();

    if (data.error) {
      return { success: false, error: data.error };
    }

    return {
      success: true,
      taskId: data.id,
      status: data.status,
      model,
      scale
    };
  } catch (error) {
    console.error('Replicate API error:', error);
    return { success: false, error: error.message };
  }
}
