import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '免费 AI 图片增强 - Real-ESRGAN 在线增强 | Finegrain',
  description: '免费在线 AI 图片放大，使用 Real-ESRGAN 模型，支持人脸增强、老照片画质提升，每日 3 张免费，快速提升画质。',
}

export default function FreeLayout({ children }: { children: React.ReactNode }) {
  return children
}
