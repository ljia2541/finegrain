'use client'

import { Check } from 'lucide-react'

const plans = [
  {
    name: '免费版',
    price: '$0',
    period: '永久免费',
    features: [
      '3 张/天',
      'Real-ESRGAN 模型',
      '最大 1920x1080 分辨率',
      '带水印',
      '24 小时自动删除',
    ],
    cta: '免费使用',
    highlighted: false,
  },
  {
    name: '积分包',
    price: '$7.99',
    period: '起 $0.04/积分',
    features: [
      '无水印',
      'Google/Crystal/Recraft 模型',
      '最高 10K 分辨率',
      '积分 6-12 个月有效',
      '优先处理',
    ],
    cta: '购买积分',
    highlighted: true,
  },
]

const creditPackages = [
  {
    credits: 100,
    price: '$4.99',
    perCredit: '$0.049',
    savings: '',
    description: '适合偶尔使用'
  },
  {
    credits: 200,
    price: '$7.99',
    perCredit: '$0.04',
    savings: '省 18%',
    description: '超高性价比',
    highlighted: true
  },
  {
    credits: 500,
    price: '$12.99',
    perCredit: '$0.026',
    savings: '省 47%',
    description: '大量使用首选'
  },
  {
    credits: 1000,
    price: '$19.99',
    perCredit: '$0.02',
    savings: '省 59%',
    description: '极致优惠'
  },
]

export default function Pricing() {
  return (
    <div>
      {/* Main Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
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

      {/* Credit Packages - Visual Cards */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8">
        <h3 className="text-3xl font-bold text-center mb-2">💰 积分包 - 批量购买更优惠</h3>
        <p className="text-center text-gray-600 mb-8">每档单价对比，让你"感觉赚翻"！</p>
        
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

              <div className="text-center text-sm text-gray-500 mb-4">
                {pkg.description}
              </div>

              <div className="text-center text-sm text-gray-600">
                有效期：{pkg.credits >= 500 ? '12 个月' : '6 个月'}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
