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
    price: '$4.99',
    period: '起 $0.049/积分',
    features: [
      '无水印',
      'HAT 高级模型',
      '最高 8K 分辨率',
      '积分 6-12 个月有效',
      '优先处理',
    ],
    cta: '购买积分',
    highlighted: true,
  },
  {
    name: '单次付费',
    price: '$0.99',
    period: '每张',
    features: [
      '无水印',
      'HAT 高级模型',
      '最高 8K 分辨率',
      '按需付费',
      '即时处理',
    ],
    cta: '立即购买',
    highlighted: false,
  },
]

const creditPackages = [
  { credits: 100, price: '$4.99', savings: '' },
  { credits: 200, price: '$7.99', savings: '省 18%' },
  { credits: 500, price: '$12.99', savings: '省 47%' },
  { credits: 1000, price: '$19.99', savings: '省 59%' },
]

export default function Pricing() {
  return (
    <div>
      {/* Main Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
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

      {/* Credit Packages */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-center mb-6">积分包详情</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">积分数量</th>
                <th className="text-left py-3 px-4">价格</th>
                <th className="text-left py-3 px-4">有效期</th>
                <th className="text-left py-3 px-4">折扣</th>
              </tr>
            </thead>
            <tbody>
              {creditPackages.map((pkg) => (
                <tr key={pkg.credits} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-semibold">{pkg.credits} 积分</td>
                  <td className="py-3 px-4">{pkg.price}</td>
                  <td className="py-3 px-4">
                    {pkg.credits >= 500 ? '12 个月' : '6 个月'}
                  </td>
                  <td className="py-3 px-4">
                    {pkg.savings && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                        {pkg.savings}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Credit Usage */}
      <div className="mt-8 text-center text-sm text-gray-600">
        <p className="mb-2"><strong>积分消耗规则：</strong></p>
        <p>简单处理（Real-ESRGAN 2x）：1 积分/张</p>
        <p>标准处理（Real-ESRGAN 4x）：2 积分/张</p>
        <p>高级处理（HAT 4x/8K）：3 积分/张</p>
      </div>
    </div>
  )
}
