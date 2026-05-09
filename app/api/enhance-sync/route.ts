import { NextRequest, NextResponse } from 'next/server'
import { enhanceImage, MODEL_CONFIG } from '@/lib/replicate'
import { getAuthSession } from '@/lib/auth'
import { getUserBalance, deductCredits, getUserBalanceSplit } from '@/lib/supabase'
import sharp from 'sharp'

export const runtime = 'nodejs'
export const maxDuration = 300

// 模型 GPU 内存限制（最大像素数，4通道）
const MODEL_MAX_PIXELS: Record<string, number> = {
  realesrgan: 1_800_000, // Real-ESRGAN GPU 约 2M 像素
  google: 4_194_304,      // Google Upscaler 约 4M 像素
  recraft: 4_194_304,    // Recraft 约 4M 像素
}

/**
 * 预处理图片：如果超过模型 GPU 内存限制，先缩图再上传到 R2
 * 返回适合模型处理的图片 URL
 */
async function preprocessImageForModel(imageUrl: string, model: string, baseUrl: string): Promise<string> {
  const maxPixels = MODEL_MAX_PIXELS[model] || 4_194_304
  
  // 获取图片尺寸
  const imgRes = await fetch(imageUrl)
  const imgBuffer = Buffer.from(await imgRes.arrayBuffer())
  const metadata = await sharp(imgBuffer).metadata()
  const width = metadata.width || 0
  const height = metadata.height || 0
  const totalPixels = width * height
  
  if (totalPixels <= maxPixels) {
    return imageUrl // 不需要处理
  }
  
  // 超出限制，按比例缩图到 GPU 能接受的最大尺寸
  const ratio = Math.sqrt(maxPixels / totalPixels)
  const newWidth = Math.round(width * ratio)
  const newHeight = Math.round(height * ratio)
  
  console.log(`[preprocess] image ${width}x${height} (${totalPixels}px) exceeds limit ${maxPixels}, resizing to ${newWidth}x${newHeight}`)
  
  const resized = await sharp(imgBuffer)
    .resize(newWidth, newHeight, { fit: 'inside', withoutEnlargement: true })
    .png({ compressionLevel: 0 })
    .toBuffer()
  
  // 上传到 R2（通过 presign API）
  const taskId = `pre_${Date.now()}`
  const presignRes = await fetch(baseUrl + '/api/presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: `pre_${taskId}.png`, contentType: 'image/png' }),
  })
  const presignData = await presignRes.json()
  if (!presignData.success) {
    console.error('[preprocess] R2 upload failed, using original URL')
    return imageUrl
  }
  
  await fetch(presignData.uploadUrl, {
    method: 'PUT',
    body: resized,
    headers: { 'Content-Type': 'image/png' },
  })
  
  console.log(`[preprocess] uploaded resized image: ${presignData.downloadUrl}`)
  return presignData.downloadUrl
}

/**
 * 获取模型所需的积分数量
 */
function getRequiredCredits(model: string, scale: number): number | null {
  const config = MODEL_CONFIG[model as keyof typeof MODEL_CONFIG]
  if (!config) return null
  return config.credits[scale as keyof typeof config.credits] || null
}

/**
 * POST /api/enhance-sync
 * 同步增强图片（等待 Replicate 处理完成）
 * 
 * 流程：
 * 1. 验证登录状态
 * 2. 检查积分余额（付费模型）
 * 3. 上传前扣除积分
 * 4. 调用 Replicate 增强
 * 5. 失败则退还积分
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageUrl, model = 'realesrgan', scale = 4, imageWidth, imageHeight, faceEnhance = false, creditSource = 'auto' } = body

    if (!imageUrl) {
      return NextResponse.json({ error: 'imageUrl is required' }, { status: 400 })
    }

    // 验证模型
    const validModels = ['realesrgan', 'recraft', 'google']
    if (!validModels.includes(model)) {
      return NextResponse.json({ error: `Invalid model: ${model}` }, { status: 400 })
    }

    // 倍率校验
    if (model === 'google') {
      if (![2, 4].includes(scale)) {
        return NextResponse.json({ error: 'Google Upscaler only supports 2x and 4x' }, { status: 400 })
      }
    }

    // ===== 积分逻辑 =====
    // 判断是否为免费模式：realesrgan 模型 + scale <= 4
    const isFreeEnhance = model === 'realesrgan' && scale <= 4
    const requiredCredits = isFreeEnhance ? 0 : getRequiredCredits(model, scale)
    let userId: string | null = null
    let creditsDeducted = false
    let taskId: string | null = null

    if (requiredCredits !== null && requiredCredits > 0) {
      // 付费模型：需要登录 + 扣积分
      const session = await getAuthSession()
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'LOGIN_REQUIRED' }, { status: 401 })
      }
      userId = session.user.id

      // 检查余额（使用拆分余额以提供详细信息）
      const balanceSplit = await getUserBalanceSplit(userId)
      const balance = balanceSplit.total
      if (balance < requiredCredits) {
        return NextResponse.json({
          error: 'INSUFFICIENT_CREDITS',
          required: requiredCredits,
          balance,
          purchaseBalance: balanceSplit.purchaseBalance,
          subscriptionBalance: balanceSplit.subscriptionBalance,
        }, { status: 402 })
      }

      // 预扣积分（在 enhance 之前）
      try {
        taskId = crypto.randomUUID()
        const result = await deductCredits(userId, requiredCredits, model, taskId, {
          inputUrl: imageUrl,
          scale,
          source: creditSource,
        })
        creditsDeducted = true
      } catch (err: any) {
        if (err.message === 'INSUFFICIENT_CREDITS') {
          // Get split balance for the error response
          let splitInfo: any = {}
          try {
            splitInfo = await getUserBalanceSplit(userId)
          } catch {}
          return NextResponse.json({
            error: 'INSUFFICIENT_CREDITS',
            required: requiredCredits,
            balance: splitInfo.total || 0,
            purchaseBalance: splitInfo.purchaseBalance || 0,
            subscriptionBalance: splitInfo.subscriptionBalance || 0,
          }, { status: 402 })
        }
        console.error('Failed to deduct credits:', err)
        return NextResponse.json({ error: 'Failed to process credits' }, { status: 500 })
      }
    }
    // Free model (realesrgan): no credit deduction, check daily limit
    if (isFreeEnhance) {
      const session = await getAuthSession()
      userId = session?.user?.id || null
      taskId = crypto.randomUUID()

      // 匿名用户每天1次，登录用户每天3次
      const freeLimit = userId ? 3 : 1
      const { supabaseAdmin } = await import('@/lib/supabase')
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const targetUserId = userId || 'anonymous'
      console.log(`[free enhance] userId=${userId}, targetUserId=${targetUserId}, taskId=${taskId}`)

      const { count: freeCount, error: countError } = await supabaseAdmin
        .from('enhancement_history')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', targetUserId)
        .gte('created_at', today.toISOString())
        .eq('status', 'completed')
      console.log(`[free enhance] todayCount=${freeCount}, countError=${countError}`)

      if (freeCount >= freeLimit) {
        return NextResponse.json({
          error: 'FREE_LIMIT_REACHED',
          message: `Daily free limit reached (${freeLimit}/${freeLimit}). Please try again tomorrow or purchase a credits pack.`,
          limit: freeLimit,
          used: freeCount,
        }, { status: 429 })
      }
    }

    // ===== 调用 Replicate =====
    try {
      // 预处理：如果图片太大，先缩图到模型能处理的尺寸
      const baseUrl = new URL(request.url).origin
      const processedImageUrl = await preprocessImageForModel(imageUrl, model, baseUrl)
      
      const result = await enhanceImage({
        image: processedImageUrl,
        model,
        scale,
        faceEnhance,
      })

      if (!result.success) {
        // 退还积分
        if (creditsDeducted && userId && taskId) {
          try {
            const { addCredits } = await import('@/lib/supabase')
            await addCredits(userId, requiredCredits!, 'refund', `增强失败退还 ${requiredCredits} 积分 (${model})`, {
              taskId,
              model,
            })
            console.log(`Refunded ${requiredCredits} credits for failed enhance, userId=${userId}`)
          } catch (refundErr) {
            console.error('Failed to refund credits:', refundErr)
          }
        }
        // 付费增强失败：更新 history 为 failed
        if (creditsDeducted && userId) {
          try {
            const { supabaseAdmin } = await import('@/lib/supabase')
            await supabaseAdmin
              .from('enhancement_history')
              .update({ status: 'failed' })
              .eq('user_id', userId)
              .eq('model', model)
              .eq('status', 'processing')
              .order('created_at', { ascending: false })
              .limit(1)
          } catch {}
        }
        return NextResponse.json({ error: result.error || 'Enhancement failed' }, { status: 500 })
      }

      // 计费信息
      let billing = null
      if (isFreeEnhance) {
        billing = { type: 'free' }
      } else if (requiredCredits !== null) {
        billing = { type: 'credits', credits: requiredCredits }
      }

      // 免费增强：添加水印；付费增强：转 PNG 确保无损
      let finalImageUrl = result.imageUrl
      try {
        const imgRes = await fetch(result.imageUrl)
        const imgBuffer = Buffer.from(await imgRes.arrayBuffer())
        
        // 直接用 R2 SDK 上传（绕过 Vercel 4.5MB 请求体限制）
        const { uploadBuffer } = await import('@/lib/r2')
        const { generatePresignedDownloadUrl } = await import('@/lib/r2')
        
        if (isFreeEnhance) {
          // 免费增强：添加水印（输出 JPEG）
          const { addWatermark } = await import('@/lib/watermark')
          const watermarked = await addWatermark(imgBuffer)
          const key = `output/watermarked_${taskId}.jpg`
          await uploadBuffer(watermarked, key, 'image/jpeg')
          finalImageUrl = await generatePresignedDownloadUrl(key, 86400) // 24小时有效
        } else {
          // 付费增强：转换为 PNG
          const sharpModule = await import('sharp')
          const sharp = sharpModule.default
          const pngBuffer = await sharp(imgBuffer).png({ compressionLevel: 0 }).toBuffer()
          console.log(`[png] converted, size=${pngBuffer.length}`)
          const key = `output/enhanced_${taskId}.png`
          await uploadBuffer(pngBuffer, key, 'image/png')
          finalImageUrl = await generatePresignedDownloadUrl(key, 86400)
          console.log(`[png] uploaded to R2: ${finalImageUrl.substring(0, 80)}...`)
        }
      } catch (err: any) {
        console.error('Failed to process output image:', err)
        // 处理失败不阻塞，用原图返回
      }

      // 记录增强历史
      if (isFreeEnhance && taskId) {
        // 免费增强：直接插入 completed 记录
        try {
          const { supabaseAdmin } = await import('@/lib/supabase')
          console.log(`[free enhance] inserting history: user_id=${userId || 'anonymous'}, taskId=${taskId}, model=${model}`)
          const { data: insertData, error: insertErr } = await supabaseAdmin.from('enhancement_history').insert({
            id: taskId,
            user_id: userId || 'anonymous',
            model,
            scale,
            credits_used: 0,
            input_url: imageUrl,
            output_url: finalImageUrl,
            status: 'completed',
          })
          console.log(`[free enhance] history insert result: data=${JSON.stringify(insertData)}, error=${JSON.stringify(insertErr)}`)
        } catch (histErr) {
          console.error('Failed to record free enhance history:', histErr)
        }
      } else if (creditsDeducted && userId) {
        // 付费增强：更新 deductCredits 创建的 processing 记录为 completed
        try {
          const { supabaseAdmin } = await import('@/lib/supabase')
          const { error: updateErr } = await supabaseAdmin
            .from('enhancement_history')
            .update({
              status: 'completed',
              output_url: finalImageUrl,
            })
            .eq('user_id', userId)
            .eq('model', model)
            .eq('status', 'processing')
            .order('created_at', { ascending: false })
            .limit(1)
          if (updateErr) {
            console.error('[paid enhance] failed to update history:', updateErr)
          } else {
            console.log(`[paid enhance] history updated to completed, userId=${userId}, model=${model}`)
          }
        } catch (histErr) {
          console.error('Failed to update paid enhance history:', histErr)
        }
      }

      return NextResponse.json({
        success: true,
        imageUrl: finalImageUrl,
        model: result.model,
        scale: result.scale,
        billing,
        creditsUsed: requiredCredits,
      })
    } catch (err) {
      // Replicate 调用出错，退还积分
      if (creditsDeducted && userId && taskId) {
        try {
          const { addCredits } = await import('@/lib/supabase')
          await addCredits(userId, requiredCredits!, 'refund', `增强出错退还 ${requiredCredits} 积分 (${model})`, {
            taskId,
            model,
          })
          console.log(`Refunded ${requiredCredits} credits for error enhance, userId=${userId}`)
        } catch (refundErr) {
          console.error('Failed to refund credits:', refundErr)
        }
        // 付费增强异常：更新 history 为 failed
        try {
          const { supabaseAdmin } = await import('@/lib/supabase')
          await supabaseAdmin
            .from('enhancement_history')
            .update({ status: 'failed' })
            .eq('user_id', userId)
            .eq('model', model)
            .eq('status', 'processing')
            .order('created_at', { ascending: false })
            .limit(1)
        } catch {}
      }
      throw err
    }
  } catch (error: any) {
    console.error('Enhance sync error:', error)
    return NextResponse.json({ error: error.message || 'Enhancement failed' }, { status: 500 })
  }
}
