export default function JsonLd() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'FineGrain',
    url: 'https://www.finegrainimageenhancer.com',
    description: 'Free AI image enhancer and upscaler. Upscale photos to 4K/10K with Real-ESRGAN, Google Upscaler, Recraft, and Crystal AI.',
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
      ratingCount: '120',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'AI Image Upscaling up to 10x',
      'Real-ESRGAN Free Enhancement',
      'Google Upscaler Natural Quality',
      'Recraft Print Quality 300DPI',
      'Crystal AI Portrait Enhancement',
      'Face Restoration',
      'Batch Processing',
      'No Signup Required',
    ],
  }

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FineGrain',
    url: 'https://www.finegrainimageenhancer.com',
    logo: 'https://www.finegrainimageenhancer.com/logo.png',
    sameAs: [],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is FineGrain free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! FineGrain offers 3 free AI image enhancements per day using Real-ESRGAN. No signup required. For higher quality models like Google Upscaler, Recraft, and Crystal, credits or subscription are needed.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the best AI image upscaler?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'FineGrain offers multiple AI upscalers for different needs: Real-ESRGAN for free enhancement, Google Upscaler for natural quality, Recraft for print-ready 300DPI output, and Crystal AI for portrait enhancement up to 10K resolution.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I upscale images for printing?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! FineGrain\'s Recraft model is specifically optimized for print quality, delivering razor-sharp text, logos, and images suitable for posters, brochures, and exhibition materials at 300DPI.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does FineGrain cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'FineGrain has a free tier (3 enhances/day) and paid plans starting at $5.99 for 100 credits. Monthly subscriptions start at $7.99/month for 200 credits. Crystal 10x is $3.99 per image.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does FineGrain work without signup?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! You can use FineGrain\'s free Real-ESRGAN enhancement without creating an account. Simply upload your image and get instant results. Signup is only needed for paid features and credit tracking.',
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}
