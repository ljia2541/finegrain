import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Print Quality AI Image Enhancer - Recraft 4x Crisp Upscale for 300DPI',
  description: 'Print-quality AI image upscaling with Recraft. Razor-sharp text, logos, and UI elements. Perfect for posters, brochures, exhibition materials, and commercial print at 300DPI. Clean, noise-free results.',
  keywords: ['print quality AI enhancer', 'Recraft upscaler', 'crisp image upscale', 'print 300DPI AI', 'commercial print enhancement', 'logo upscaler AI', 'AI image enhancer for printing', 'upscale image for poster', 'brochure image quality enhancer', 'sharp text image upscale AI', 'ecommerce product photo enhancer'],
  openGraph: {
    title: 'Print Quality AI Enhancer - Recraft 4x | FineGrain',
    description: 'Print-quality AI upscaling with Recraft. Perfect for 300DPI commercial print.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
