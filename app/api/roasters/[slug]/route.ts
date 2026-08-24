import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { publicCacheHeaders, SHOP_DATA_TTL } from '@/lib/cacheHeaders'
import { getRoasterBySlug } from '@/app/utils/roasters'
import { SHOP_WITH_ROASTER_SELECT } from '@/app/utils/utils'
import { getClient } from '@/lib/supabase/server-client'

// Shops that serve this roaster's coffee (joined via shops.roaster_id), so the
// roaster page can show where to drink it. Mirrors getCompanyShops.
const getRoasterShops = async (roasterId: string) => {
  const { data, error } = await getClient()
    .from('shops')
    .select(SHOP_WITH_ROASTER_SELECT)
    .eq('roaster_id', roasterId)

  if (error) {
    logger.error('Error fetching roaster shops', { error: error.message })
    return null
  }

  return data
}

export async function GET(req: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  const { slug } = params

  const roasterData = await getRoasterBySlug(slug)

  if (!roasterData) {
    return NextResponse.json({ message: 'Roaster not found' }, { status: 404 })
  }

  const shops = await getRoasterShops(roasterData.id)

  if (shops === null) {
    return NextResponse.json({ error: 'Error fetching roaster shops' }, { status: 500 })
  }

  return NextResponse.json({ ...roasterData, shops }, { headers: publicCacheHeaders(SHOP_DATA_TTL) })
}
