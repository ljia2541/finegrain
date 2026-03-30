'use client'

import EnhancePage from '@/components/EnhancePage'

export default function PortraitEnhancePage() {
  return (
    <EnhancePage
      title="人像专业增强"
      subtitle="Crystal 模型专为人像优化，无塑料感，还原真实细节"
      models={[{ id: 'crystal', name: 'Crystal 4x', credits: 15 }]}
      scales={[4]}
      isFree={false}
      currentCredits={0}
      maxLongEdge={1000}
      badge="人像专精"
      badgeColor="bg-purple-500"
      tips={[
        '仅适合人像照片',
        '图片长边不可超过 1000px',
        '无塑料感，真实人像细节',
      ]}
    />
  )
}
