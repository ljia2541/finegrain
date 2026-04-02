import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI 图片增强 - Google Upscaler 通用增强 | Finegrain',
  description: '使用 Google Upscaler 进行 AI 图片增强，自然保真、不夸张，适合风景、产品、日常照片通用增强。',
}

export default function GeneralLayout({ children }: { children: React.ReactNode }) {
  return children
}
