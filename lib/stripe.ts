import Stripe from 'stripe'

/**
 * Stripe 客户端（服务端使用）
 * 支付密钥在后端使用，不暴露给前端
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-03-25.dahlia',
})

/**
 * Stripe 商品配置
 * 
 * 使用方式：
 * 1. 在 Stripe Dashboard 创建 Products 和 Prices
 * 2. 将 Price ID 填入下方配置
 * 3. 前端使用 Price ID 创建 Checkout Session
 */
export const STRIPE_PRICES = {
  // 积分包（一次性支付）- Price ID 待创建
  credits: {
    '100': { priceId: 'price_placeholder_100', credits: 100, validityDays: 90 },
    '200': { priceId: 'price_placeholder_200', credits: 200, validityDays: 90 },
    '500': { priceId: 'price_placeholder_500', credits: 500, validityDays: 180 },
    '1000': { priceId: 'price_placeholder_1000', credits: 1000, validityDays: 180 },
  },
  // 月订阅（自动续费）- Price ID 待创建
  subscriptions: {
    pro: { priceId: 'price_placeholder_pro', credits: 200 },
    max: { priceId: 'price_placeholder_max', credits: 500 },
    ultra: { priceId: 'price_placeholder_ultra', credits: 1000 },
  },
  // Crystal 10x 一次性支付
  crystal10x: { priceId: 'price_placeholder_crystal10x', credits: 0 },
} as const

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.finegrainimageenhancer.com'

/**
 * 创建 Stripe Checkout Session（一次性支付）
 */
export async function createCheckoutSession(
  priceId: string,
  userId: string,
  mode: 'payment' | 'subscription' = 'payment',
  metadata?: Record<string, string>,
) {
  const session = await stripe.checkout.sessions.create({
    mode,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}/payment/cancel`,
    client_reference_id: userId,
    metadata: metadata || {},
    // 允许未登录用户购买（后续通过 webhook 关联账户）
    allow_promotion_codes: true,
  })

  return session
}

/**
 * 创建 Stripe Checkout Session（月订阅）
 */
export async function createSubscriptionSession(
  planId: string,
  userId: string,
) {
  const planConfig = STRIPE_PRICES.subscriptions[planId as keyof typeof STRIPE_PRICES.subscriptions]
  if (!planConfig) throw new Error(`Invalid subscription plan: ${planId}`)

  return createCheckoutSession(
    planConfig.priceId,
    userId,
    'subscription',
    { planType: 'subscription', planId },
  )
}

/**
 * 创建 Stripe Checkout Session（积分包）
 */
export async function createCreditCheckoutSession(
  creditPlanId: string,
  userId: string,
) {
  const planConfig = STRIPE_PRICES.credits[creditPlanId as keyof typeof STRIPE_PRICES.credits]
  if (!planConfig) throw new Error(`Invalid credit plan: ${creditPlanId}`)

  return createCheckoutSession(
    planConfig.priceId,
    userId,
    'payment',
    { planType: 'credits', planId: creditPlanId },
  )
}

/**
 * 验证 Stripe Webhook 签名
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not configured')
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}

/**
 * 获取 Stripe Checkout Session 详情
 */
export async function getCheckoutSession(sessionId: string) {
  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items'],
  })
}
