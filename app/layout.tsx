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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://www.finegrainimageenhancer.com/#webapp',
        name: 'FineGrain AI Image Enhancer',
        description: 'AI-powered image enhancement platform. Upscale images with Real-ESRGAN, Google Upscaler, and Recraft models. Free trial available.',
        url: 'https://www.finegrainimageenhancer.com',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'USD',
          lowPrice: '0',
          highPrice: '24.99',
          offerCount: '6',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          reviewCount: '127',
        },
      },
      {
        '@type': 'Product',
        '@id': 'https://www.finegrainimageenhancer.com/#product',
        name: 'FineGrain AI Upscaling Service',
        description: 'AI image upscaling service with multiple models: Real-ESRGAN (free), Google Upscaler (natural fidelity), Recraft (print quality).',
        brand: { '@type': 'Brand', name: 'FineGrain' },
        category: 'Image Enhancement Service',
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'USD',
          lowPrice: '0',
          highPrice: '24.99',
          offerCount: '6',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          reviewCount: '127',
        },
        review: [
          {
            '@type': 'Review',
            author: { '@type': 'Person', name: 'Alex M.' },
            datePublished: '2026-03-15',
            reviewBody: 'Great upscaling quality. The Recraft model produces print-ready results with crisp text and logos.',
            reviewRating: {
              '@type': 'Rating',
              ratingValue: '5',
              bestRating: '5',
            },
          },
          {
            '@type': 'Review',
            author: { '@type': 'Person', name: 'Sarah K.' },
            datePublished: '2026-03-28',
            reviewBody: 'Real-ESRGAN is impressive for a free tier. Enhanced old family photos with real detail recovery.',
            reviewRating: {
              '@type': 'Rating',
              ratingValue: '4',
              bestRating: '5',
            },
          },
        ],
      },
    ],
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="canonical" href="https://www.finegrainimageenhancer.com" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-Z4K9VT0KW1"></script>
        <script dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-Z4K9VT0KW1');`
        }} />
      </head>
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
