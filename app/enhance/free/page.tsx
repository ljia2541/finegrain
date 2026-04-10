'use client'

import { useState, useEffect } from 'react'
import EnhancePage from '@/components/EnhancePage'
import { useCredits } from '@/hooks/useCredits'

interface FreeUsage {
  used: number
  limit: number
  remaining: number
  isAnonymous: boolean
}

export default function FreeEnhancePage() {
  const { credits, purchaseCredits, subscriptionCredits, formattedExpiry, formattedSubExpiry } = useCredits()
  const [freeUsage, setFreeUsage] = useState<FreeUsage | null>(null)

  const refreshFreeUsage = () => {
    fetch('/api/free-usage')
      .then(res => res.json())
      .then(data => setFreeUsage(data))
      .catch(() => {})
  }

  useEffect(() => {
    refreshFreeUsage()
  }, [])

  const tips = [
    'Basic quality enhancement',
    `Daily limit: ${freeUsage ? freeUsage.limit : 1} (${freeUsage ? `${freeUsage.remaining} remaining today` : '1 remaining today'})`,
    'Output with watermark',
    'Auto deleted after 24h',
  ]

  return (
    <EnhancePage
      title="Free Image Enhancer"
      subtitle="Try AI image enhancement instantly, no account needed"
      models={[{ id: 'realesrgan', name: 'Real-ESRGAN', credits: 0 }]}
      scales={[2, 4]}
      isFree
      currentCredits={credits}
      purchaseCredits={purchaseCredits}
      subscriptionCredits={subscriptionCredits}
      creditsExpirySoon={formattedExpiry}
      subExpirySoon={formattedSubExpiry}
      badge="Free"
      badgeColor="bg-green-500"
      tips={tips}
      onSuccess={refreshFreeUsage}
    />
  )
}
