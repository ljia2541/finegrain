import Pricing from '@/components/Pricing'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '定价 - FineGrain AI 图像增强',
  description: '灵活的定价方案，积分包按需购买，月订阅更划算。免费版每天3张，Crystal 10x 单张付费。',
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="pt-24 pb-16 px-4">
        <h1 className="text-4xl font-bold text-center mb-4">简单透明的定价</h1>
        <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
          选择适合你的方案，从免费试用到专业订阅
        </p>
        <Pricing />
      </div>
    </main>
  )
}
