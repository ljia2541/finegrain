'use client'

import EnhancePage from '@/components/EnhancePage'
import { useCredits } from '@/hooks/useCredits'

export default function GeneralEnhancePage() {
  const { credits, purchaseCredits, subscriptionCredits, formattedExpiry, formattedSubExpiry } = useCredits()

  return (
    <EnhancePage
      title="General Image Enhancement"
      subtitle="Multiple models and scales for all image types"
      models={[
        {
          id: 'realesrgan',
          name: 'Real-ESRGAN',
          credits: 1,
          description: 'Fast basic enhancement, great for everyday use',
          tag: 'Budget',
          tagColor: 'bg-green-500',
        },
        {
          id: 'google',
          name: 'Google Upscaler',
          credits: 3,
          description: 'Natural fidelity, works on any image, stable and commercial.',
          tag: 'Recommended',
          tagColor: 'bg-blue-500',
        },
        {
          id: 'recraft',
          name: 'Recraft',
          credits: 6,
          description: 'Extremely sharp, text and logos especially crisp, great for printing',
          tag: 'Sharpest',
          tagColor: 'bg-indigo-500',
        },
        {
          id: 'crystal',
          name: 'Crystal 4x',
          credits: 15,
          description: 'Portrait specialist, no plastic look, 4x only',
          tag: 'Portrait',
          tagColor: 'bg-purple-500',
        },
      ]}
      scales={[2, 4]}
      isFree={false}
      currentCredits={credits}
      purchaseCredits={purchaseCredits}
      subscriptionCredits={subscriptionCredits}
      creditsExpirySoon={formattedExpiry}
      subExpirySoon={formattedSubExpiry}
      badge="General"
      tips={[
        'Crystal 4x supports 4x only, original must have long edge ≤ 1000px',
        'Different models excel at different things — switch and compare',
        'Not sure which to pick? Google Upscaler is stable and reliable.',
      ]}
    />
  )
}
