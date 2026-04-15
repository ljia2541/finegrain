import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AuthProvider from '@/components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Free AI Image Enhancer - Upscale Photos Online | FineGrain',
    template: '%s | FineGrain',
  },
  description: 'Free AI image enhancer and upscaler. Upscale photos to 4K/10K with Real-ESRGAN, Google Upscaler, Recraft, and Crystal AI. Enhance blurry photos, restore old images, improve print quality. No signup required.',
  keywords: ['AI image enhancer', 'free image upscaler', 'upscale photo online', 'AI photo enhancer', 'image quality enhancer', 'Real-ESRGAN', 'super resolution', 'photo enhancement AI', 'FineGrain', 'enhance blurry photo', 'upscale image to 4K', 'AI image upscaler free', 'photo resolution enhancer', 'image upscale AI', 'improve image quality', 'enhance photo for print', 'old photo restoration AI', 'face enhancement AI', 'image enlargement AI', 'AI photo resolution'],
  authors: [{ name: 'FineGrain' }],
  creator: 'FineGrain',
  metadataBase: new URL('https://www.finegrainimageenhancer.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'FineGrain',
    title: 'FineGrain - Free AI Image Enhancer | Upscale Photos to 4K/10K',
    description: 'Free AI image enhancer & upscaler. Upscale photos to 4K and 10K with Real-ESRGAN, Google Upscaler, Recraft, and Crystal AI. Fix blurry photos, enhance faces, improve print quality. Try free!',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'FineGrain AI Image Enhancement',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FineGrain - Free AI Image Enhancer & Upscaler',
    description: 'Free AI image enhancer. Upscale to 4K/10K. Fix blurry photos, enhance faces, print quality. Try free!',
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
        description: 'Free AI image enhancer and upscaler. Upscale photos to 4K/10K with Real-ESRGAN, Google Upscaler, Recraft, and Crystal AI. Fix blurry photos, enhance faces, improve print quality.',
        url: 'https://www.finegrainimageenhancer.com',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'USD',
          lowPrice: '0',
          highPrice: '29.99',
          offerCount: '6',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          reviewCount: '127',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://www.finegrainimageenhancer.com/#organization',
        name: 'FineGrain',
        url: 'https://www.finegrainimageenhancer.com',
        logo: 'https://www.finegrainimageenhancer.com/logo.png',
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.finegrainimageenhancer.com/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Is FineGrain free to use?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes! FineGrain offers 3 free AI image enhancements per day using Real-ESRGAN. No signup required. For higher quality models, credits or subscription are needed.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is the best AI image upscaler?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'FineGrain offers multiple AI models: Real-ESRGAN (free), Google Upscaler (natural quality), Recraft (print-ready 300DPI), Crystal AI (portrait up to 10K).',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I upscale images for printing?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: "Yes! FineGrain's Recraft model is optimized for print quality, delivering razor-sharp output suitable for posters, brochures at 300DPI.",
            },
          },
          {
            '@type': 'Question',
            name: 'Does FineGrain work without signup?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: "Yes! Use FineGrain's free Real-ESRGAN enhancement without an account. Signup is only needed for paid features and credit tracking.",
            },
          },
        ],
      },
      {
        '@type': 'Product',
        '@id': 'https://www.finegrainimageenhancer.com/#product',
        name: 'FineGrain AI Upscaling Service',
        description: 'AI image upscaling with Real-ESRGAN (free), Google Upscaler (natural fidelity), Recraft (print quality), Crystal AI (portrait 10K).',
        brand: { '@type': 'Brand', name: 'FineGrain' },
        category: 'Image Enhancement Service',
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'USD',
          lowPrice: '0',
          highPrice: '29.99',
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
            reviewBody: 'Great upscaling quality. Recraft produces print-ready results with crisp text and logos.',
            reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
          },
          {
            '@type': 'Review',
            author: { '@type': 'Person', name: 'Sarah K.' },
            datePublished: '2026-03-28',
            reviewBody: 'Real-ESRGAN is impressive for free. Enhanced old family photos with real detail recovery.',
            reviewRating: { '@type': 'Rating', ratingValue: '4', bestRating: '5' },
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
