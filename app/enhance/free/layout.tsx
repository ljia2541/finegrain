import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Online Photo Enhancer - Professional AI Upscale No Sign Up | FineGrain',
  description: 'Free online photo enhancer with professional AI quality. Enhance and upscale photos with Real-ESRGAN 4x, face restoration, fix blurry photos, sharpen details, upscale to 4K. No signup required. 3 free enhances per day.',
  keywords: ['free online photo enhancer', 'free photo enhancer online', 'free image upscaler online', 'upscale photo free no sign up', 'Real-ESRGAN online free', 'enhance photo quality free', 'blur photo fix AI', 'face enhancement AI free', '4K image upscaler free', 'sharpen blurry photo online', 'free photo resolution enhancer', 'AI photo enhancer no signup', 'upscale image free online', 'free professional photo enhancer', 'photo enhancer no signup'],
  openGraph: {
    title: 'Free Online Photo Enhancer - Professional AI Quality | FineGrain',
    description: 'Free online photo enhancer. Professional AI quality, 4x upscale, face restoration, no signup. Try now!',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
