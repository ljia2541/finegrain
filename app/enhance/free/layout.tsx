import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free AI Image Enhancer - Real-ESRGAN 4x Upscale',
  description: 'Free AI image upscaling with Real-ESRGAN. Enhance low-resolution photos, restore faces, fix blurry images, and output 4K quality. No signup required. Limited 3 free enhance per day.',
  keywords: ['free AI image enhancer', 'Real-ESRGAN free', 'free image upscaler', 'photo enhancement free', 'blur photo fix', 'face enhancement AI'],
  openGraph: {
    title: 'Free AI Image Enhancer | FineGrain',
    description: 'Free AI image upscaling with Real-ESRGAN. 3 free enhances per day.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
