'use client'

import EnhancePage from '@/components/EnhancePage'
import { useCredits } from '@/hooks/useCredits'

export default function PrintEnhancePage() {
  const { credits, purchaseCredits, subscriptionCredits, formattedExpiry, formattedSubExpiry } = useCredits()

  return (
    <EnhancePage
      title="Print-Ready Enhancement"
      subtitle="Recraft model delivers print-ready clarity, razor-sharp text and logos"
      models={[{ id: 'recraft', name: 'Recraft', credits: 6 }]}
      scales={[2]}
      isFree={false}
      currentCredits={credits}
      purchaseCredits={purchaseCredits}
      subscriptionCredits={subscriptionCredits}
      creditsExpirySoon={formattedExpiry}
      subExpirySoon={formattedSubExpiry}
      badge="Print Ready"
      badgeColor="bg-indigo-500"
      tips={[
        'Perfect for printing, posters, and brochures',
        'Crisp output with no jaggies',
        'Text and logos especially sharp',
      ]}
    />
  )
}
