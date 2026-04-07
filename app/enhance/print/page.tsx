'use client'

import EnhancePage from '@/components/EnhancePage'
import { useCredits } from '@/hooks/useCredits'

export default function PrintEnhancePage() {
  const { credits, purchaseCredits, subscriptionCredits, formattedExpiry, formattedSubExpiry } = useCredits()

  return (
    <EnhancePage
      title="印刷级高清增强"
      subtitle="Recraft 模型输出印刷级清晰度，文字 Logo 锐利无锯齿"
      models={[{ id: 'recraft', name: 'Recraft', credits: 6 }]}
      scales={[2]}
      isFree={false}
      currentCredits={credits}
      purchaseCredits={purchaseCredits}
      subscriptionCredits={subscriptionCredits}
      creditsExpirySoon={formattedExpiry}
      subExpirySoon={formattedSubExpiry}
      badge="印刷级"
      badgeColor="bg-indigo-500"
      tips={[
        '适合打印、海报、画册',
        '输出清晰无锯齿',
        '文字/Logo 特别锐利',
      ]}
    />
  )
}
