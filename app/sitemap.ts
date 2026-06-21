import type { MetadataRoute } from 'next'
import {
  SITE_URL,
  buildShopUrl,
  buildEventUrl,
  buildNewsUrl,
  getAllShopsForSeo,
  getAllEventsForSeo,
  getAllUpdatesForSeo,
} from '@/app/utils/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [shops, events, updates] = await Promise.all([
    getAllShopsForSeo(),
    getAllEventsForSeo(),
    getAllUpdatesForSeo(),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL },
    { url: `${SITE_URL}/about` },
    { url: `${SITE_URL}/submit-a-shop` },
  ]

  const shopPages: MetadataRoute.Sitemap = shops.map(shop => ({ url: buildShopUrl(shop) }))
  const eventPages: MetadataRoute.Sitemap = events.map(event => ({ url: buildEventUrl(event) }))
  const newsPages: MetadataRoute.Sitemap = updates.map(update => ({ url: buildNewsUrl(update) }))

  return [...staticPages, ...shopPages, ...eventPages, ...newsPages]
}
