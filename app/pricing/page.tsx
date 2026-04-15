import Pricing from '@/components/Pricing'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing - AI Image Enhancement Plans | FineGrain',
  description: 'Flexible pricing for AI image enhancement. Pay-as-you-go credits from $5.99 or monthly subscriptions from $7.99. 3 free enhancements daily. No hidden fees, cancel anytime.',
  keywords: ['AI image enhancer pricing', 'image upscaler plans', 'photo enhancement subscription', 'pay per image enhancement', 'credit based image upscaler'],
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="pt-24 pb-16 px-4">
        <h1 className="text-4xl font-bold text-center mb-4">Simple, Transparent Pricing</h1>
        <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
          Choose your plan, from free trial to professional subscription
        </p>
        <Pricing />
      </div>
    </main>
  )
}
