import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI 印刷级增强 - Recraft 细节恢复 | Finegrain',
  description: 'Recraft AI 印刷级图片增强，极致清晰无噪点，文字/Logo/线条特别锐利，适合网页海报、电商产品图、300DPI 印刷。',
}

export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return children
}
