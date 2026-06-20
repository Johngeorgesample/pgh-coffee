import { NextRequest, NextResponse } from 'next/server'
import { formatDBShopAsFeature } from '@/app/utils/utils'
import { extractUuidPrefix } from '@/app/utils/shopSlug'
import { getShopByUuidPrefix } from '@/app/utils/shops'
import { metrics } from '@/lib/metrics'
import { withMetrics } from '@/lib/withMetrics'
import { publicCacheHeaders, SHOP_DATA_TTL } from '@/lib/cacheHeaders'

export const GET = withMetrics('shops/by-slug/[slug]', async (req: NextRequest, props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params

  const prefix = extractUuidPrefix(slug)
  if (!prefix) {
    metrics.shopNotFound('invalid_slug')
    return NextResponse.json({ message: 'Shop not found' }, { status: 404 })
  }

  let shop
  try {
    shop = await getShopByUuidPrefix(prefix)
  } catch {
    metrics.apiError('shops/by-slug/[slug]')
    return NextResponse.json({ message: 'Error fetching shop' }, { status: 500 })
  }

  if (!shop) {
    metrics.shopNotFound('no_match')
    return NextResponse.json({ message: 'Shop not found' }, { status: 404 })
  }

  metrics.shopViewed(shop.name, shop.neighborhood)
  return NextResponse.json(formatDBShopAsFeature(shop), { headers: publicCacheHeaders(SHOP_DATA_TTL) })
})
