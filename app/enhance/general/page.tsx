'use client'

import EnhancePage from '@/components/EnhancePage'
import { useCredits } from '@/hooks/useCredits'

export default function GeneralEnhancePage() {
  const { credits, formattedExpiry } = useCredits()

  return (
    <EnhancePage
      title="通用图片增强"
      subtitle="多模型多倍率，满足各类图片增强需求"
      models={[
        {
          id: 'realesrgan',
          name: 'Real-ESRGAN',
          credits: 1,
          description: '基础增强，速度快，适合日常使用',
          tag: '省钱',
          tagColor: 'bg-green-500',
        },
        {
          id: 'google',
          name: 'Google Upscaler',
          credits: 3,
          description: '自然保真，不挑图，稳定可商用',
          tag: '推荐',
          tagColor: 'bg-blue-500',
        },
        {
          id: 'recraft',
          name: 'Recraft',
          credits: 6,
          description: '极致清晰，文字/Logo 锐利，适合印刷',
          tag: '最清晰',
          tagColor: 'bg-indigo-500',
        },
        {
          id: 'crystal',
          name: 'Crystal 4x',
          credits: 15,
          description: '人像专精，无塑料感，仅支持 4x',
          tag: '人像',
          tagColor: 'bg-purple-500',
        },
      ]}
      scales={[2, 4]}
      isFree={false}
      currentCredits={credits}
      creditsExpirySoon={formattedExpiry}
      badge="通用"
      tips={[
        'Crystal 4x 仅支持 4x 倍率，且原图长边 ≤ 1000px',
        '不同模型效果各有侧重，可切换对比',
        '不知道选哪个？推荐 Google Upscaler，稳定不出错',
      ]}
    />
  )
}
