import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Google Upscaler - Natural Fidelity AI Enhancement',
  description: 'Google-powered AI image enhancement. Ultra natural, no over-sharpening, no plastic look. Best for everyday photos, product images, and AI-generated art. Credits: 3 per enhance.',
  keywords: ['Google Upscaler', 'natural image enhancement', 'AI upscaler Google', 'product photo enhancement', 'AI art upscale'],
  openGraph: {
    title: 'Google Upscaler - Natural Fidelity | FineGrain',
    description: 'Google-powered AI image enhancement. Natural fidelity, stable quality.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
