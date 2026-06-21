import type { MetadataRoute } from 'next'
import { SITE_URL, buildShopUrl, getAllShopsForSeo } from '@/app/utils/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const shops = await getAllShopsForSeo()

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL },
    { url: `${SITE_URL}/about` },
    { url: `${SITE_URL}/submit-a-shop` },
  ]

  const shopPages: MetadataRoute.Sitemap = shops.map(shop => ({
    url: buildShopUrl(shop),
  }))

  return [...staticPages, ...shopPages]
}
