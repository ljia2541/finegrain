import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portrait AI Enhancer - Crystal 4x Face & Portrait Upscale',
  description: 'AI portrait enhancement specializing in faces and people. Crystal 4x delivers natural skin tones, no plastic smoothing, up to 10K output. Perfect for portraits, selfies, and group photos. Credits: 15 per enhance.',
  keywords: ['portrait AI enhancer', 'face enhancement AI', 'Crystal 4x portrait', 'upscale portrait photos', 'face upscaler AI', 'portrait photo enhancement'],
  openGraph: {
    title: 'Portrait AI Enhancer - Crystal 4x | FineGrain',
    description: 'AI portrait enhancement with Crystal 4x. Natural faces, up to 10K output.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
