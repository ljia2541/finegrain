'use client'

import EnhancePage from '@/components/EnhancePage'
import { useCredits } from '@/hooks/useCredits'

export default function PortraitEnhancePage() {
  const { credits, purchaseCredits, subscriptionCredits, formattedExpiry, formattedSubExpiry } = useCredits()

  return (
    <EnhancePage
      title="Portrait Enhancement"
      subtitle="Crystal model optimized for portraits, natural and realistic"
      models={[{ id: 'crystal', name: 'Crystal 4x', credits: 15 }]}
      scales={[4]}
      isFree={false}
      currentCredits={credits}
      purchaseCredits={purchaseCredits}
      subscriptionCredits={subscriptionCredits}
      creditsExpirySoon={formattedExpiry}
      subExpirySoon={formattedSubExpiry}
      maxLongEdge={1000}
      badge="Portrait Pro"
      badgeColor="bg-purple-500"
      tips={[
        'Best for portrait photos only',
        'Image long edge must be ≤ 1000px',
        'Natural look, real portrait details',
      ]}
    />
  )
}
