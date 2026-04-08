import Pricing from '@/components/Pricing'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing - FineGrain AI Image Enhancement',
  description: 'Flexible pricing plans. Pay-as-you-go credits or monthly subscription. 3 free daily enhancements.',
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
