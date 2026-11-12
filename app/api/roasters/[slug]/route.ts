import { NextRequest, NextResponse } from 'next/server'
import { publicCacheHeaders, SHOP_DATA_TTL } from '@/lib/cacheHeaders'
import { getRoasterBySlug, getRoasterShops } from '@/app/utils/roasters'

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
