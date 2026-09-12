import type { MetadataRoute } from 'next'
import { SITE_URL, buildShopUrl, getAllShopsForSeo } from '@/app/utils/seo'
import { ADVENT_LINEUP } from '@/data/advent'
import { openDoorCount } from '@/app/utils/advent'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const shops = await getAllShopsForSeo()

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL },
    { url: `${SITE_URL}/about` },
    { url: `${SITE_URL}/submit-a-shop` },
    { url: `${SITE_URL}/stickers` },
    { url: `${SITE_URL}/advent` },
  ]

  // Sealed days carry nothing worth indexing, so they join the sitemap as they open.
  const adventPages: MetadataRoute.Sitemap = ADVENT_LINEUP.filter(
    entry => entry.day <= openDoorCount()
  ).map(entry => ({ url: `${SITE_URL}/advent/${entry.day}` }))

  const shopPages: MetadataRoute.Sitemap = shops.map(shop => ({
    url: buildShopUrl(shop),
  }))

  return [...staticPages, ...adventPages, ...shopPages]
}
