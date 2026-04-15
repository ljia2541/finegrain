import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Image Enhancer - Natural Quality Upscale | Google Upscaler',
  description: 'Google-powered AI image enhancement with ultra-natural fidelity. No over-sharpening, no plastic look. Best for everyday photos, product images, and AI-generated art. Fast and stable results.',
  keywords: ['Google Upscaler', 'natural image enhancement', 'AI upscaler Google', 'product photo enhancement', 'AI art upscale', 'AI image enhancer natural', 'upscale photo without artifacts', 'enhance product image AI', 'AI photo quality improver', 'image resolution enhancer online'],
  openGraph: {
    title: 'Google Upscaler - Natural Fidelity | FineGrain',
    description: 'Google-powered AI image enhancement. Natural fidelity, stable quality.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
