'use client'

import EnhancePage from '@/components/EnhancePage'
import { useCredits } from '@/hooks/useCredits'

export default function UltraEnhancePage() {
  const { credits, purchaseCredits, subscriptionCredits, formattedExpiry, formattedSubExpiry } = useCredits()

  return (
    <EnhancePage
      title="10x Ultra Portrait Enhancement"
      subtitle="Crystal 10x super resolution, up to 10K output, maximum portrait detail"
      models={[{ id: 'crystal10x', name: 'Crystal 10x', credits: 0 }]}
      scales={[10]}
      isFree={false}
      directPrice="$3.99/image"
      currentCredits={credits}
      purchaseCredits={purchaseCredits}
      subscriptionCredits={subscriptionCredits}
      creditsExpirySoon={formattedExpiry}
      subExpirySoon={formattedSubExpiry}
      maxLongEdge={1000}
      badge="VIP"
      badgeColor="bg-yellow-500"
      tips={[
        'Best for portrait photos only',
        'Image long edge must be ≤ 1000px',
        'Up to 10K output',
        'Separate payment, does not use credits',
      ]}
    />
  )
}
