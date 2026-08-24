import { NextResponse } from 'next/server'
import { formatDataToGeoJSON, SHOP_WITH_ROASTER_SELECT } from '@/app/utils/utils'
import { logger } from '@/lib/logger'
import { getClient } from '@/lib/supabase/server-client'

const fetchShopsByIds = async (ids: string[]) => {
  const { data, error } = await getClient()
    .from('shops')
    .select(SHOP_WITH_ROASTER_SELECT)
    .in('uuid', ids)
    .order('name', { ascending: true })

  if (error) {
    logger.error('Error fetching shops by IDs', { error: error.message })
    return null
  }
  return data
}

// API Route Handler
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const idsParam = searchParams.get('ids')

  if (!idsParam) {
    return NextResponse.json(
      { error: 'Missing ids parameter' },
      { status: 400 }
    )
  }

  const ids = idsParam.split(',').map(id => id.trim()).filter(id => id.length > 0)

  if (ids.length === 0) {
    return NextResponse.json(formatDataToGeoJSON([]))
  }

  const shops = await fetchShopsByIds(ids)

  if (shops === null) {
    return NextResponse.json(
      { error: 'Error fetching shops' },
      { status: 500 }
    )
  }

  // No shared-CDN cache: this response varies by the `ids` query string, but the
  // CDN keys its cache on the path alone, so a cached copy would be served for
  // different id sets, returning the wrong shops.
  const geojson = formatDataToGeoJSON(shops)
  return NextResponse.json(geojson)
}
