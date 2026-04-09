import type { MetadataRoute } from 'next'

const BASE_URL = 'https://www.finegrainimageenhancer.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/enhance/free',
    '/enhance/general',
    '/enhance/portrait',
    '/enhance/print',
    '/pricing',
    '/docs',
    '/terms',
  ]

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/pricing' ? 0.9 : 0.7,
  }))
}
