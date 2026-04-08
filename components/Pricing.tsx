'use client'

import { useSession, signIn } from 'next-auth/react'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'Forever free',
    features: [
      '3 images/day',
      'Real-ESRGAN + Face Enhancement',
      'Up to 4K display',
      'With watermark',
      'Auto deleted after 24h',
    ],
    cta: 'Get Started',
    highlighted: false,
    action: 'free',
  },
  {
    name: 'Credits Pack',
    price: '$9.99',
    period: 'From $0.03/credit',
    features: [
      'No watermark',
      'Crystal Portrait + Recraft Detail',
      'Up to 4K display (credit mode)',
      'Credits valid 90-180 days',
      'Priority processing',
    ],
    cta: 'Buy Credits',
    highlighted: true,
    action: 'credits',
  },
  {
    name: 'Crystal 10x',
    price: '$3.99',
    period: '/image',
    features: [
      'Up to 10K portrait ultra HD output',
      'Portrait specialist, no plastic look',
      'Separate payment, no credits',
      '⚠️ Original must be ≤ 1000px',
      'Perfect for portrait retouching and poster output',
    ],
    cta: 'Use Now',
    highlighted: false,
    action: 'crystal10x',
  },
]

const creditPackages = [
  {
    credits: 100,
    price: '$5.99',
    perCredit: '$0.059',
    savings: '',
    description: 'Great for occasional use, easy paid features access',
    validity: '90 days',
  },
  {
    credits: 200,
    price: '$9.99',
    perCredit: '$0.05',
    savings: '省 15%',
    description: 'Best value for daily image enhancement',
    validity: '90 days',
    highlighted: true,
  },
  {
    credits: 500,
    price: '$19.99',
    perCredit: '$0.04',
    savings: '省 32%',
    description: 'Best for heavy use and creative projects',
    validity: '180 days',
  },
  {
    credits: 1000,
    price: '$29.99',
    perCredit: '$0.03',
    savings: '省 49%',
    description: 'Best deal for frequent professional users',
    validity: '180 days',
  },
]

const subscriptionPlans = [
  {
    name: 'Pro',
    monthlyPrice: '$7.99',
    yearlyPrice: '$5.99',
    credits: 200,
    perCredit: '$0.04',
    period: '月',
    features: [
      '200 credits auto-added monthly',
      'Use until depleted, resets monthly',
      'No watermark + priority processing',
      '所有付费模型可用（Crystal 10x $3.99/张另付）',
    ],
    cta: 'Subscribe Pro',
    highlighted: false,
    planId: 'pro',
  },
  {
    name: 'Max',
    monthlyPrice: '$14.99',
    yearlyPrice: '$11.99',
    credits: 500,
    perCredit: '$0.03',
    period: '月',
    features: [
      '500 credits auto-added monthly',
      'Use until depleted, resets monthly',
      'No watermark + priority processing',
      '所有付费模型可用（Crystal 10x $3.99/张另付）',
    ],
    cta: 'Subscribe Max',
    highlighted: true,
    planId: 'max',
  },
  {
    name: 'Ultra',
    monthlyPrice: '$24.99',
    yearlyPrice: '$19.99',
    credits: 1000,
    perCredit: '$0.025',
    period: '月',
    features: [
      '1000 credits auto-added monthly',
      'Use until depleted, resets monthly',
      'No watermark + priority processing',
      '所有付费模型可用（Crystal 10x $3.99/张另付）',
    ],
    cta: 'Subscribe Ultra',
    highlighted: false,
    planId: 'ultra',
  },
]

export default function Pricing() {
  const { data: session } = useSession()

  const handlePurchase = async (planType: string, planId: string) => {
    if (planType === 'free') return

    // 积分包需要登录
    if ((planType === 'credits' || planType === 'subscription') && !session?.user) {
      signIn('google', { callbackUrl: '/pricing' })
      return
    }

    try {
      // 月订阅走专门的 API
      if (planType === 'subscription') {
        const res = await fetch('/api/payment/create-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId }),
        })

        const data = await res.json()

        if (data.error === 'LOGIN_REQUIRED') {
          signIn('google', { callbackUrl: '/pricing' })
          return
        }

        if (data.success && data.approveUrl) {
          window.location.href = data.approveUrl
        } else {
          alert('订阅创建失败：' + (data.error || 'PayPal 订阅计划尚未配置，请先使用积分包'))
        }
        return
      }

      // 一次性支付
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType, planId }),
      })

      const data = await res.json()

      if (data.error === 'LOGIN_REQUIRED') {
        signIn('google', { callbackUrl: '/pricing' })
        return
      }

      if (data.success && data.approvalUrl) {
        window.location.href = data.approvalUrl
      } else {
        alert('支付创建失败：' + (data.error || '未知错误'))
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('支付请求失败，请稍后重试')
    }
  }

  return (
    <div>
      {/* Main Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`bg-white rounded-lg shadow-md p-8 ${
              plan.highlighted ? 'ring-2 ring-blue-600' : ''
            }`}
          >
            {plan.highlighted && (
              <div className="text-center mb-4">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  最受欢迎
                </span>
              </div>
            )}
            <h3 className="text-2xl font-bold text-center mb-2">{plan.name}</h3>
            <div className="text-center mb-6">
              <span className="text-4xl font-bold">{plan.price}</span>
              {plan.period && (
                <span className="text-gray-600 ml-2">{plan.period}</span>
              )}
            </div>
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => {
                if (plan.action === 'credits') {
                  handlePurchase('credits', '200')
                } else if (plan.action === 'free') {
                  window.location.href = '/enhance/free'
                } else {
                  handlePurchase(plan.action, '')
                }
              }}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                plan.highlighted
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Monthly Subscriptions - FIRST */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-8 mb-12">
        <h3 className="text-3xl font-bold text-center mb-2">🔄 月订阅 - 每月自动到账更划算</h3>
        <p className="text-center text-gray-600 mb-8">固定用量选订阅，比积分包更便宜，随时取消</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-lg shadow-md p-6 relative transition-transform hover:scale-105 ${
                plan.highlighted ? 'ring-2 ring-indigo-600 shadow-xl' : ''
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                    最受欢迎
                  </span>
                </div>
              )}

              <div className="text-center mb-4 mt-2">
                <div className="text-2xl font-bold text-indigo-600 mb-1">{plan.name}</div>
              </div>

              <div className="text-center mb-2">
                <div className="text-4xl font-bold text-gray-900">{plan.monthlyPrice}</div>
                <div className="text-gray-500">/月</div>
              </div>

              <div className="text-center mb-4">
                <div className="text-sm text-gray-600">{plan.credits} 积分/月</div>
                <div className="text-sm text-green-600 font-semibold">年付 {plan.yearlyPrice}/月，省 25%</div>
              </div>

              <ul className="space-y-2 mb-6 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase('subscription', plan.planId)}
                className={`w-full py-3 rounded-lg font-semibold transition-colors text-sm ${
                  plan.highlighted
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Credit Packages - SECOND */}
      <div id="credit-packages" className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8">
        <h3 className="text-3xl font-bold text-center mb-2">💰 积分包 - 按需购买，灵活使用</h3>
        <p className="text-center text-gray-600 mb-8">积分不过期快，适合偶尔使用或囤货慢慢用</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {creditPackages.map((pkg) => (
            <div
              key={pkg.credits}
              className={`bg-white rounded-lg shadow-md p-6 relative transition-transform hover:scale-105 ${
                pkg.highlighted ? 'ring-2 ring-blue-600 shadow-xl' : ''
              }`}
            >
              {pkg.savings && (
                <div className="absolute -top-3 -right-3">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    🔥 {pkg.savings}
                  </span>
                </div>
              )}
              
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-blue-600 mb-1">{pkg.credits}</div>
                <div className="text-gray-600">积分</div>
              </div>
              
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-gray-900">{pkg.price}</div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">每积分单价</div>
                  <div className="text-2xl font-bold text-blue-700">{pkg.perCredit}</div>
                </div>
              </div>

              <div className="text-center text-sm text-blue-700 font-semibold mb-4">
                ✅ 推荐 · {pkg.description}
              </div>

              <div className="text-center text-sm text-orange-600 font-semibold mb-4">
                有效期：{pkg.validity}
              </div>

              <button
              onClick={() => handlePurchase('credits', String(pkg.credits))}
                className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors"
              >
                购买
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
