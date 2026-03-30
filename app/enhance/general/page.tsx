'use client'

import EnhancePage from '@/components/EnhancePage'

export default function GeneralEnhancePage() {
  return (
    <EnhancePage
      title="通用图片增强"
      subtitle="多模型多倍率，满足各类图片增强需求"
      models={[
        { id: 'realesrgan', name: 'Real-ESRGAN', credits: 1 },
        { id: 'google', name: 'Google Upscaler', credits: 3 },
        { id: 'recraft', name: 'Recraft', credits: 6 },
      ]}
      scales={[2, 4, 6, 8, 10]}
      isFree={false}
      currentCredits={0}
      badge="通用"
      tips={[
        '适合产品图、截图、插画、风景、AI 绘画',
        '不同模型效果各有侧重',
      ]}
    />
  )
}
