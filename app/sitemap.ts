import type { MetadataRoute } from 'next'
import { SITE_URL, buildShopUrl, getAllShopsForSeo, getNeighborhoodAreas } from '@/app/utils/seo'
import { areaPath } from '@/app/utils/neighborhoodAreas'
import { ADVENT_LINEUP } from '@/data/advent'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const shops = await getAllShopsForSeo()
  const areas = await getNeighborhoodAreas()

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL },
    { url: `${SITE_URL}/about` },
    { url: `${SITE_URL}/submit-a-shop` },
    { url: `${SITE_URL}/stickers` },
    { url: `${SITE_URL}/neighborhoods` },
    { url: `${SITE_URL}/advent` },
  ]

  const areaPages: MetadataRoute.Sitemap = areas.map(({ area }) => ({
    url: `${SITE_URL}${areaPath(area)}`,
  }))

  const adventPages: MetadataRoute.Sitemap = ADVENT_LINEUP.map(entry => ({
    url: `${SITE_URL}/advent/${entry.day}`,
  }))

  const shopPages: MetadataRoute.Sitemap = shops.map(shop => ({
    url: buildShopUrl(shop),
  }))

  return [...staticPages, ...areaPages, ...adventPages, ...shopPages]
}
