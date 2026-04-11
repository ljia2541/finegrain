import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portrait AI Enhancer - Natural Face & Portrait Upscale',
  description: 'AI portrait enhancement specializing in faces and people. Google Upscaler delivers natural skin tones with no plastic smoothing. Perfect for portraits, selfies, and group photos. Credits: 4 per enhance.',
  keywords: ['portrait AI enhancer', 'face enhancement AI', 'portrait upscale', 'upscale portrait photos', 'face upscaler AI', 'portrait photo enhancement'],
  openGraph: {
    title: 'Portrait AI Enhancer | FineGrain',
    description: 'AI portrait enhancement with Google Upscaler. Natural faces, great results.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
