import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free AI Image Enhancer Online - Upscale Photos No Sign Up | FineGrain',
  description: 'Enhance and upscale images for free with AI. Real-ESRGAN 4x upscaling, face restoration, blurry photo fix. No signup required. 3 free enhances per day. Try now!',
  keywords: ['free AI image enhancer', 'free image upscaler online', 'upscale photo free no sign up', 'Real-ESRGAN online free', 'enhance photo quality free', 'blur photo fix AI', 'face enhancement AI free', '4K image upscaler free'],
  openGraph: {
    title: 'Free AI Image Enhancer Online - No Sign Up | FineGrain',
    description: 'Enhance images for free with AI. 4x upscale, face restoration, no signup. Try now!',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
