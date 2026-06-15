import { NextRequest, NextResponse } from 'next/server'
import { formatDBShopAsFeature } from '@/app/utils/utils'
import { extractUuidPrefix } from '@/app/utils/shopSlug'
import { getShopByUuidPrefix } from '@/app/utils/shops'
import { metrics } from '@/lib/metrics'
import { withMetrics } from '@/lib/withMetrics'

export const GET = withMetrics('shops/by-slug/[slug]', async (req: NextRequest, props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params

  const prefix = extractUuidPrefix(slug)
  const shop = prefix ? await getShopByUuidPrefix(prefix) : null

  if (!shop) {
    metrics.shopNotFound(slug)
    return NextResponse.json({ message: 'Shop not found' }, { status: 404 })
  }

  metrics.shopViewed(shop.name, shop.neighborhood)
  return NextResponse.json(formatDBShopAsFeature(shop))
})
