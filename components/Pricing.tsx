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
    period: '起 $0.035/积分',
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
  {
    credits: 100,
    price: '$4.99',
    perCredit: '$0.05',
    savings: '',
    description: '适合偶尔使用'
  },
  {
    credits: 200,
    price: '$7.99',
    perCredit: '$0.035',
    savings: '省 30%',
    description: '超高性价比',
    highlighted: true
  },
  {
    credits: 500,
    price: '$12.99',
    perCredit: '$0.026',
    savings: '省 48%',
    description: '大量使用首选'
  },
  {
    credits: 1000,
    price: '$19.99',
    perCredit: '$0.02',
    savings: '省 60%',
    description: '极致优惠'
  },
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

        {/* Price Comparison Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-xl font-bold text-center mb-4">📊 价格对比一目了然</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold">积分包</th>
                  <th className="text-center py-3 px-4 font-semibold">总价</th>
                  <th className="text-center py-3 px-4 font-semibold">每积分</th>
                  <th className="text-center py-3 px-4 font-semibold">节省</th>
                </tr>
              </thead>
              <tbody>
                {creditPackages.map((pkg, index) => (
                  <tr key={pkg.credits} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-3 px-4 font-semibold">{pkg.credits} 积分包</td>
                    <td className="py-3 px-4 text-center font-bold">{pkg.price}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-semibold">
                        {pkg.perCredit}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {pkg.savings ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-bold">
                          {pkg.savings}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Credit Usage Rules */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
        <h4 className="text-2xl font-bold text-center mb-6">🎯 积分消耗规则 - 简单透明</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">📷</div>
              <h5 className="font-bold text-lg mb-2">普通图片</h5>
              <div className="text-3xl font-bold text-green-600">1 积分</div>
              <div className="text-sm text-gray-600">每张图片</div>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• 2x 放大（Real-ESRGAN）</p>
              <p>• 1080p 及以下分辨率</p>
              <p>• 快速处理</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🖼️</div>
              <h5 className="font-bold text-lg mb-2">4K/8K 大图</h5>
              <div className="text-3xl font-bold text-blue-600">2-3 积分</div>
              <div className="text-sm text-gray-600">每张图片</div>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• 4x 放大（Real-ESRGAN）</p>
              <p>• 4K/8K 高分辨率输出</p>
              <p>• HAT 高级模型可选</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🚀</div>
              <h5 className="font-bold text-lg mb-2">高倍放大</h5>
              <div className="text-3xl font-bold text-purple-600">额外 +1 积分</div>
              <div className="text-sm text-gray-600">在基础之上</div>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• 8x 超高倍放大</p>
              <p>• 极致细节恢复</p>
              <p>• 专业级输出质量</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <h5 className="font-bold text-lg mb-4 text-center">💡 实际案例参考</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="border-l-4 border-green-500 pl-4">
              <p className="font-semibold mb-2">普通照片放大 2x：</p>
              <p className="text-gray-600">原始 1080p → 增强 2x → <span className="font-bold text-green-600">1 积分</span></p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="font-semibold mb-2">老照片修复 4x：</p>
              <p className="text-gray-600">原始 720p → 增强 4x → <span className="font-bold text-blue-600">2 积分</span></p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <p className="font-semibold mb-2">高分辨率 8K 输出：</p>
              <p className="text-gray-600">原始 4K → HAT 模型 → <span className="font-bold text-purple-600">3 积分</span></p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <p className="font-semibold mb-2">极致放大 8x：</p>
              <p className="text-gray-600">原始 1080p → 8x 放大 → <span className="font-bold text-orange-600">4 积分</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
