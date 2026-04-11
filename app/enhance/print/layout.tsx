import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Print Quality AI Enhancer - Recraft 4x Crisp Upscale',
  description: 'Print-quality AI image upscaling with Recraft. Razor-sharp text, logos, and UI elements. Perfect for海报, 画册, 展览 materials, and commercial print at 300DPI. Credits: 6 per enhance.',
  keywords: ['print quality AI enhancer', 'Recraft upscaler', 'crisp image upscale', 'print 300DPI AI', 'commercial print enhancement', 'logo upscaler AI'],
  openGraph: {
    title: 'Print Quality AI Enhancer - Recraft 4x | FineGrain',
    description: 'Print-quality AI upscaling with Recraft. Perfect for 300DPI commercial print.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
