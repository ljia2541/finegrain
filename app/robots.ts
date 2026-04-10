import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/', '/payment/'],
    },
    sitemap: 'https://www.finegrainimageenhancer.com/sitemap.xml',
  }
}
