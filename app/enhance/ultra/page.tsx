'use client'

import EnhancePage from '@/components/EnhancePage'
import { useCredits } from '@/hooks/useCredits'

export default function UltraEnhancePage() {
  const { credits, formattedExpiry } = useCredits()

  return (
    <EnhancePage
      title="10 倍超清人像增强"
      subtitle="Crystal 10x 超分辨率，最高 10K 输出，人像细节拉满"
      models={[{ id: 'crystal10x', name: 'Crystal 10x', credits: 0 }]}
      scales={[10]}
      isFree={false}
      directPrice="$3.99/张"
      currentCredits={credits}
      creditsExpirySoon={formattedExpiry}
      maxLongEdge={1000}
      badge="VIP"
      badgeColor="bg-yellow-500"
      tips={[
        '仅适合人像照片',
        '图片长边不可超过 1000px',
        '最高 10K 输出',
        '单独付费，不走积分',
      ]}
    />
  )
}
