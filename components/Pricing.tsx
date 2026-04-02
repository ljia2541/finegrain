'use client'

import { Check } from 'lucide-react'

const plans = [
  {
    name: '免费版',
    price: '$0',
    period: '永久免费',
    features: [
      '3 张/天',
      'Real-ESRGAN + 人像细节优化',
      '最高 4K 尺寸显示',
      '带水印',
      '24 小时自动删除',
    ],
    cta: '立即试用',
    highlighted: false,
  },
  {
    name: '积分包',
    price: '$9.99',
    period: '起 $0.03-0.059/积分',
    features: [
      '无水印',
      'Crystal 人像专精 + Recraft 细节恢复',
      '最高 4K 尺寸显示（积分模式）',
      '积分 90-180 天有效',
      '优先处理',
    ],
    cta: '购买积分',
    highlighted: true,
  },
  {
    name: 'Crystal 10x',
    price: '$3.99',
    period: '/张',
    features: [
      '最高 10K 人像超高清输出',
      '人像专精，无塑料感',
      '单独付费，不走积分',
      '⚠️ 原图需 ≤ 1000px',
      '适合人像精修、人像类海报输出',
    ],
    cta: '立即使用',
    highlighted: false,
  },
]

const creditPackages = [
  {
    credits: 100,
    price: '$5.99',
    perCredit: '$0.059',
    savings: '',
    description: '适合偶尔使用，轻松体验付费功能',
    validity: '90 天',
  },
  {
    credits: 200,
    price: '$9.99',
    perCredit: '$0.05',
    savings: '省 15%',
    description: '超高性价比，满足日常图片增强',
    validity: '90 天',
    highlighted: true,
  },
  {
    credits: 500,
    price: '$19.99',
    perCredit: '$0.04',
    savings: '省 32%',
    description: '大量使用首选，适合项目创作',
    validity: '180 天',
  },
  {
    credits: 1000,
    price: '$29.99',
    perCredit: '$0.03',
    savings: '省 49%',
    description: '极致优惠，适合高频专业用户',
    validity: '180 天',
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
      '每月 200 积分自动到账',
      '用完即止，下月重置',
      '无水印 + 优先处理',
      '所有付费模型可用（Crystal 10x $3.99/张另付）',
    ],
    cta: '订阅 Pro',
    highlighted: false,
  },
  {
    name: 'Max',
    monthlyPrice: '$14.99',
    yearlyPrice: '$11.99',
    credits: 500,
    perCredit: '$0.03',
    period: '月',
    features: [
      '每月 500 积分自动到账',
      '用完即止，下月重置',
      '无水印 + 优先处理',
      '所有付费模型可用（Crystal 10x $3.99/张另付）',
    ],
    cta: '订阅 Max',
    highlighted: true,
  },
  {
    name: 'Ultra',
    monthlyPrice: '$24.99',
    yearlyPrice: '$19.99',
    credits: 1000,
    perCredit: '$0.025',
    period: '月',
    features: [
      '每月 1000 积分自动到账',
      '用完即止，下月重置',
      '无水印 + 优先处理',
      '所有付费模型可用（Crystal 10x $3.99/张另付）',
    ],
    cta: '订阅 Ultra',
    highlighted: false,
  },
]

export default function Pricing() {
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
                <div className="text-sm text-green-600 font-semibold">年付 ${plan.yearlyPrice}/月，省 25%</div>
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
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8">
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

              <div className="text-center text-sm text-orange-600 font-semibold">
                有效期：{pkg.validity}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
