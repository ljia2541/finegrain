import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free AI Image Enhancer Online - Upscale Photos No Sign Up | FineGrain',
  description: 'Enhance and upscale images for free with AI. Real-ESRGAN 4x upscaling with face restoration. Fix blurry photos, sharpen details, upscale to 4K. No signup required. 3 free enhances per day.',
  keywords: ['free AI image enhancer', 'free image upscaler online', 'upscale photo free no sign up', 'Real-ESRGAN online free', 'enhance photo quality free', 'blur photo fix AI', 'face enhancement AI free', '4K image upscaler free', 'sharpen blurry photo online', 'free photo resolution enhancer', 'AI photo enhancer no signup', 'upscale image free online'],
  openGraph: {
    title: 'Free AI Image Enhancer Online - No Sign Up | FineGrain',
    description: 'Enhance images for free with AI. 4x upscale, face restoration, no signup. Try now!',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
