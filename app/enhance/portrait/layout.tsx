import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Portrait Enhancer - Crystal Clear Face & Portrait Upscale to 10K',
  description: 'AI portrait enhancement specializing in faces and people. Crystal AI delivers natural skin tones with no plastic smoothing, upscale to 10K. Perfect for portraits, selfies, headshots, and group photos.',
  keywords: ['portrait AI enhancer', 'face enhancement AI', 'portrait upscale', 'upscale portrait photos', 'face upscaler AI', 'portrait photo enhancement', 'AI headshot enhancer', 'selfie upscale AI', 'enhance face photo online', 'portrait photo quality improver', 'AI skin tone enhancer'],
  openGraph: {
    title: 'Portrait AI Enhancer | FineGrain',
    description: 'AI portrait enhancement with Google Upscaler. Natural faces, great results.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
