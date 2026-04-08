'use client'

import EnhancePage from '@/components/EnhancePage'
import { useCredits } from '@/hooks/useCredits'

export default function PortraitEnhancePage() {
  const { credits, purchaseCredits, subscriptionCredits, formattedExpiry, formattedSubExpiry } = useCredits()

  return (
    <EnhancePage
      title="Portrait Enhancement"
      subtitle="Google Upscaler optimized for portraits, natural and realistic"
      models={[
        {
          id: 'google',
          name: 'Google Upscaler',
          credits: 3,
          description: 'Natural fidelity, works on any image, great for portraits',
          tag: 'Recommended',
          tagColor: 'bg-blue-500',
        },
        {
          id: 'recraft',
          name: 'Recraft',
          credits: 6,
          description: 'Extremely sharp, text and logos especially crisp',
          tag: 'Sharpest',
          tagColor: 'bg-indigo-500',
        },
      ]}
      scales={[2, 4]}
      isFree={false}
      currentCredits={credits}
      purchaseCredits={purchaseCredits}
      subscriptionCredits={subscriptionCredits}
      creditsExpirySoon={formattedExpiry}
      subExpirySoon={formattedSubExpiry}
      badge="Portrait Pro"
      badgeColor="bg-purple-500"
      tips={[
        'Best for portrait photos and general images',
        'Google Upscaler preserves natural skin texture',
        'Not sure which to pick? Google Upscaler is stable and reliable.',
      ]}
    />
  )
}
