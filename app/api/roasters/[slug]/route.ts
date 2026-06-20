import { NextRequest, NextResponse } from 'next/server'
import { publicCacheHeaders, SHOP_DATA_TTL } from '@/lib/cacheHeaders'
import { getRoasterBySlug } from '@/app/utils/roasters'

export async function GET(req: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  const { slug } = params

  const roasterData = await getRoasterBySlug(slug)

  if (!roasterData) {
    return NextResponse.json({ message: 'Roaster not found' }, { status: 404 })
  }

  return NextResponse.json(roasterData, { headers: publicCacheHeaders(SHOP_DATA_TTL) })
}
