import { NextRequest, NextResponse } from 'next/server'
import { enhanceImage, validateCrystalInput, CRYSTAL_MAX_LONG_EDGE, CRYSTAL_10X_PRICE, MODEL_CONFIG } from '@/lib/replicate'
import { getAuthSession } from '@/lib/auth'
import { getUserBalance, deductCredits } from '@/lib/supabase'

export const runtime = 'nodejs'
export const maxDuration = 300

/**
 * 获取模型所需的积分数量
 */
function getRequiredCredits(model: string, scale: number): number | null {
  if (model === 'crystal' && scale === 10) return null // 10x 走直接付费，不走积分
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
    const { imageUrl, model = 'realesrgan', scale = 4, imageWidth, imageHeight, faceEnhance = false } = body

    if (!imageUrl) {
      return NextResponse.json({ error: 'imageUrl is required' }, { status: 400 })
    }

    // 验证模型
    const validModels = ['crystal', 'realesrgan', 'recraft', 'google']
    if (!validModels.includes(model)) {
      return NextResponse.json({ error: `Invalid model: ${model}` }, { status: 400 })
    }

    // Crystal 尺寸校验
    if (model === 'crystal') {
      if (imageWidth && imageHeight) {
        const validation = validateCrystalInput(imageWidth, imageHeight)
        if (!validation.valid) {
          return NextResponse.json({ error: validation.message }, { status: 400 })
        }
      }
    }

    // 倍率校验
    if (model === 'google') {
      if (![2, 4].includes(scale)) {
        return NextResponse.json({ error: 'Google Upscaler only supports 2x and 4x' }, { status: 400 })
      }
    }

    // ===== 积分逻辑 =====
    const requiredCredits = getRequiredCredits(model, scale)
    let userId: string | null = null
    let creditsDeducted = false
    let taskId: string | null = null
    let isFreeEnhance = false

    if (requiredCredits !== null && requiredCredits > 0) {
      // 付费模型：需要登录 + 扣积分
      const session = await getAuthSession()
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'LOGIN_REQUIRED' }, { status: 401 })
      }
      userId = session.user.id

      // 检查余额
      const balance = await getUserBalance(userId)
      if (balance < requiredCredits) {
        return NextResponse.json({
          error: 'INSUFFICIENT_CREDITS',
          required: requiredCredits,
          balance,
        }, { status: 402 })
      }

      // 预扣积分（在 enhance 之前）
      try {
        taskId = crypto.randomUUID()
        await deductCredits(userId, requiredCredits, model, taskId, {
          inputUrl: imageUrl,
          scale,
        })
        creditsDeducted = true
      } catch (err: any) {
        if (err.message === 'INSUFFICIENT_CREDITS') {
          return NextResponse.json({
            error: 'INSUFFICIENT_CREDITS',
            required: requiredCredits,
          }, { status: 402 })
        }
        console.error('Failed to deduct credits:', err)
        return NextResponse.json({ error: 'Failed to process credits' }, { status: 500 })
      }
    }
    // Free model (realesrgan) or direct pay (crystal 10x): no credit deduction
    if (requiredCredits === 0) {
      isFreeEnhance = true
      const session = await getAuthSession()
      userId = session?.user?.id || null
      taskId = crypto.randomUUID()

      // 每日免费限制：3 次
      const { supabaseAdmin } = await import('@/lib/supabase')
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const { data: todayCount, error: countError } = await supabaseAdmin
        .from('enhancement_history')
        .select('id', { count: 'exact', head: true })
        .eq(userId ? 'user_id' : 'user_id', userId || '')
        .gte('created_at', today.toISOString())
        .eq('status', 'completed')

      // 对未登录用户，按 user_id = 'anonymous' 无法区分，所以也计入匿名用户
      // 简化方案：未登录也尝试登录获取 session，没有则用 IP 查
      let freeCount = todayCount?.length || 0

      // 未登录时，通过 enhancement_history 查当天总免费量（近似）
      if (!userId) {
        const { count: anonCount } = await supabaseAdmin
          .from('enhancement_history')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today.toISOString())
          .eq('model', 'realesrgan')
          .eq('status', 'completed')
        freeCount = anonCount || 0
      }

      if (freeCount >= 3) {
        return NextResponse.json({
          error: 'FREE_LIMIT_REACHED',
          message: '今日免费次数已用完（3/3），请明天再试或购买积分包解锁更多功能',
          limit: 3,
          used: freeCount,
        }, { status: 429 })
      }
    }

    // ===== 调用 Replicate =====
    try {
      const result = await enhanceImage({
        image: imageUrl,
        model,
        scale: model === 'recraft' ? 4 : scale,
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
        return NextResponse.json({ error: result.error || 'Enhancement failed' }, { status: 500 })
      }

      // 计费信息
      let billing = null
      if (model === 'crystal' && scale === 10) {
        billing = { type: 'direct_pay', price: CRYSTAL_10X_PRICE, currency: 'USD' }
      } else if (isFreeEnhance) {
        billing = { type: 'free' }
      } else if (requiredCredits !== null) {
        billing = { type: 'credits', credits: requiredCredits }
      }

      // 记录增强历史（免费增强也需要记录以计数）
      if (isFreeEnhance && taskId) {
        try {
          const { supabaseAdmin } = await import('@/lib/supabase')
          await supabaseAdmin.from('enhancement_history').insert({
            id: taskId,
            user_id: userId || 'anonymous',
            model,
            scale,
            credits_used: 0,
            input_url: imageUrl,
            output_url: result.imageUrl,
            status: 'completed',
          })
        } catch (histErr) {
          console.error('Failed to record free enhance history:', histErr)
        }
      }

      return NextResponse.json({
        success: true,
        imageUrl: result.imageUrl,
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
      }
      throw err
    }
  } catch (error: any) {
    console.error('Enhance sync error:', error)
    return NextResponse.json({ error: error.message || 'Enhancement failed' }, { status: 500 })
  }
}
