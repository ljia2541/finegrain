/**
 * 自动创建 PayPal Billing Plans（Pro/Max/Ultra）
 * 
 * 用法：npx tsx scripts/create-paypal-plans.ts
 * 
 * 创建成功后会输出 Plan ID，填入 Vercel 环境变量即可。
 * 如果 Plan 已存在（同名），会先查询已有的，不会重复创建。
 */

const PAYPAL_BASE_URL = process.env.PAYPAL_MODE === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID!
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!

const PLANS = [
  {
    key: 'PRO',
    name: 'FineGrain Pro',
    description: 'Pro 月订阅 - 每月 200 积分',
    price: '7.99',
  },
  {
    key: 'MAX',
    name: 'FineGrain Max',
    description: 'Max 月订阅 - 每月 500 积分',
    price: '14.99',
  },
  {
    key: 'ULTRA',
    name: 'FineGrain Ultra',
    description: 'Ultra 月订阅 - 每月 1000 积分',
    price: '24.99',
  },
]

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

async function findExistingPlan(token: string, name: string): Promise<string | null> {
  const res = await fetch(`${PAYPAL_BASE_URL}/v1/billing/plans?product_id=&page_size=100`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return null
  const data = await res.json()
  const existing = data.plans?.find((p: any) => p.name === name && p.status === 'ACTIVE')
  return existing?.id || null
}

async function createPlan(token: string, plan: typeof PLANS[0]): Promise<string> {
  // 1. Create Product
  const productRes = await fetch(`${PAYPAL_BASE_URL}/v1/catalogs/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: plan.name,
      description: plan.description,
      type: 'SERVICE',
      category: 'SOFTWARE',
    }),
  })

  if (!productRes.ok) {
    const text = await productRes.text()
    throw new Error(`Create product failed: ${text}`)
  }

  const product = await productRes.json()
  console.log(`  ✅ Product created: ${product.id} (${plan.name})`)

  // 2. Create Plan
  const planRes = await fetch(`${PAYPAL_BASE_URL}/v1/billing/plans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      product_id: product.id,
      name: plan.name,
      description: plan.description,
      status: 'ACTIVE',
      billing_cycles: [
        {
          frequency: {
            interval_unit: 'MONTH',
            interval_count: 1,
          },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0, // 0 = infinite
          pricing_scheme: {
            fixed_price: {
              currency_code: 'USD',
              value: plan.price,
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee_failure_action: 'CONTINUE',
        payment_failure_threshold: 3,
      },
    }),
  })

  if (!planRes.ok) {
    const text = await planRes.text()
    throw new Error(`Create plan failed: ${text}`)
  }

  const planData = await planRes.json()
  console.log(`  ✅ Plan created: ${planData.id} ($${plan.price}/month)`)
  return planData.id
}

async function main() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('❌ PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET env vars required')
    process.exit(1)
  }

  console.log(`🌐 Environment: ${process.env.PAYPAL_MODE === 'live' ? 'LIVE' : 'SANDBOX'}`)
  console.log(`🔗 Base URL: ${PAYPAL_BASE_URL}`)
  console.log('')

  const token = await getAccessToken()
  console.log('✅ PayPal access token obtained\n')

  const results: Record<string, string> = {}

  for (const plan of PLANS) {
    console.log(`📋 Processing ${plan.name} ($${plan.price}/month)...`)
    
    // Check if plan already exists
    const existingId = await findExistingPlan(token, plan.name)
    if (existingId) {
      console.log(`  ⏭️  Already exists: ${existingId}`)
      results[plan.key] = existingId
    } else {
      const id = await createPlan(token, plan)
      results[plan.key] = id
    }
    console.log('')
  }

  console.log('═══════════════════════════════════════')
  console.log('✅ All plans ready! Set these env vars:')
  console.log('═══════════════════════════════════════')
  console.log('')
  for (const [key, id] of Object.entries(results)) {
    console.log(`PAYPAL_PLAN_${key}=${id}`)
  }
  console.log('')
  console.log('Copy these to Vercel env vars or your .env.local')
}

main().catch((err) => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
