/**
 * PayPal 支付模块
 * 直接调用 PayPal REST API（沙箱环境）
 */

const PAYPAL_BASE_URL = process.env.PAYPAL_MODE?.trim() === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID!
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!

/**
 * PayPal 商品配置
 */
export const PAYPAL_PLANS = {
  credits: {
    '100': {
      name: 'FineGrain 100 积分',
      description: '100 积分包 - 90天有效',
      price: '5.99',
      currency: 'USD',
      credits: 100,
      validityDays: 90,
    },
    '200': {
      name: 'FineGrain 200 积分',
      description: '200 积分包 - 90天有效',
      price: '9.99',
      currency: 'USD',
      credits: 200,
      validityDays: 90,
    },
    '500': {
      name: 'FineGrain 500 积分',
      description: '500 积分包 - 180天有效',
      price: '19.99',
      currency: 'USD',
      credits: 500,
      validityDays: 180,
    },
    '1000': {
      name: 'FineGrain 1000 积分',
      description: '1000 积分包 - 180天有效',
      price: '29.99',
      currency: 'USD',
      credits: 1000,
      validityDays: 180,
    },
  },
  crystal10x: {
    name: 'Crystal 10x 单次增强',
    description: '10K 人像超高清增强 - 1张',
    price: '3.99',
    currency: 'USD',
  },
} as const

export type CreditPlanKey = keyof typeof PAYPAL_PLANS.credits

const SUBSCRIPTION_CONFIG = {
  pro: { name: 'FineGrain Pro', description: 'Pro 月订阅 - 200积分/月', price: '7.99', credits: 200 },
  max: { name: 'FineGrain Max', description: 'Max 月订阅 - 500积分/月', price: '14.99', credits: 500 },
  ultra: { name: 'FineGrain Ultra', description: 'Ultra 月订阅 - 1000积分/月', price: '24.99', credits: 1000 },
} as const

/**
 * 获取 PayPal Access Token
 */
async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')

  const res = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${auth}`,
    },
    body: 'grant_type=client_credentials',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`PayPal auth failed: ${res.status} ${text}`)
  }

  const data = await res.json()
  return data.access_token
}

/**
 * 创建 PayPal 订单（一次性支付）
 */
export async function createOrder(
  planType: 'credits' | 'crystal10x',
  planId: string,
  userId?: string,
): Promise<{ orderId: string; approvalUrl: string }> {
  let amount = ''
  let description = ''

  if (planType === 'credits') {
    const plan = PAYPAL_PLANS.credits[planId as CreditPlanKey]
    if (!plan) throw new Error(`Invalid credit plan: ${planId}`)
    amount = plan.price
    description = plan.description
  } else if (planType === 'crystal10x') {
    amount = PAYPAL_PLANS.crystal10x.price
    description = PAYPAL_PLANS.crystal10x.description
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.finegrainimageenhancer.com'
  const token = await getAccessToken()

  const res = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: amount,
        },
        description,
        custom_id: JSON.stringify({ planType, planId, userId }),
      }],
      application_context: {
        brand_name: 'FineGrain',
        return_url: `${appUrl}/payment/success`,
        cancel_url: `${appUrl}/payment/cancel`,
        user_action: 'PAY_NOW',
      },
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`PayPal create order failed: ${res.status} ${text}`)
  }

  const order = await res.json()

  const approvalUrl = order.links?.find(
    (link: any) => link.rel === 'approve'
  )?.href || ''

  return {
    orderId: order.id,
    approvalUrl,
  }
}

/**
 * 捕获（确认）PayPal 支付
 */
export async function captureOrder(orderId: string): Promise<any> {
  const token = await getAccessToken()

  const res = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`PayPal capture failed: ${res.status} ${text}`)
  }

  return res.json()
}

/**
 * 获取订单详情
 */
export async function getOrder(orderId: string): Promise<any> {
  const token = await getAccessToken()

  const res = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`PayPal get order failed: ${res.status} ${text}`)
  }

  return res.json()
}

/**
 * 验证 PayPal Webhook 签名
 */
export async function verifyWebhookSignature(
  body: string,
  headers: Record<string, string>,
): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID
  if (!webhookId) {
    console.warn('PAYPAL_WEBHOOK_ID not set, skipping webhook verification')
    return true
  }

  const token = await getAccessToken()

  const res = await fetch(`${PAYPAL_BASE_URL}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      transmission_id: headers['paypal-transmission-id'],
      transmission_time: headers['paypal-transmission-time'],
      cert_url: headers['paypal-cert-url'],
      auth_algo: headers['paypal-auth-algo'],
      transmission_sig: headers['paypal-transmission-sig'],
      webhook_id: webhookId,
      webhook_event: JSON.parse(body),
    }),
  })

  const data = await res.json()
  return data.verification_status === 'SUCCESS'
}

export { SUBSCRIPTION_CONFIG }
// PayPal Live mode
