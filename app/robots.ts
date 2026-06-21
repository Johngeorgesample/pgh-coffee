import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/app/utils/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/account', '/settings', '/sign-in'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
