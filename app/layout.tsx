import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AuthProvider from '@/components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'FineGrain - AI Image Enhancer | Online AI Upscaling',
    template: '%s | FineGrain',
  },
  description: 'AI-powered image enhancement platform. Upscale images with Real-ESRGAN, Google Upscaler, and Recraft models. Free trial available.',
  keywords: ['AI image enhancer', 'image upscaler', 'super resolution', 'photo enhancement', 'Real-ESRGAN', 'AI upscaling', 'image quality', 'FineGrain'],
  authors: [{ name: 'FineGrain' }],
  creator: 'FineGrain',
  metadataBase: new URL('https://www.finegrainimageenhancer.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'FineGrain',
    title: 'FineGrain - AI Image Enhancer | Upscale Images up to 4x',
    description: 'Enhance and upscale your images with AI. Recraft for print quality, Google Upscaler for natural fidelity, Real-ESRGAN for free. Try now!',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'FineGrain AI Image Enhancement',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FineGrain - AI Image Enhancer',
    description: 'AI-powered image enhancement. Upscale to 4x. Free trial available.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
