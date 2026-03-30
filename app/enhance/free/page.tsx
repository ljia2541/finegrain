'use client'

import EnhancePage from '@/components/EnhancePage'

export default function FreeEnhancePage() {
  return (
    <EnhancePage
      title="免费图片增强"
      subtitle="零门槛体验 AI 图片增强，快速提升画质"
      models={[{ id: 'realesrgan', name: 'Real-ESRGAN', credits: 0 }]}
      scales={[2, 4]}
      isFree
      currentCredits={0}
      badge="免费"
      badgeColor="bg-green-500"
      tips={[
        '效果为基础增强',
        '每日限 3 张',
        '输出带水印',
        '24 小时自动删除',
      ]}
    />
  )
}
