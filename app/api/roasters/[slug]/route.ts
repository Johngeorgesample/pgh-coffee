import { NextRequest, NextResponse } from 'next/server'
import { publicCacheHeaders, SHOP_DATA_TTL } from '@/lib/cacheHeaders'
import { getRoasterWithShops } from '@/app/utils/roasters'

export async function GET(req: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params

  let roaster
  try {
    roaster = await getRoasterWithShops(slug)
  } catch {
    return NextResponse.json({ error: 'Error fetching roaster' }, { status: 500 })
  }

  if (!roaster) {
    return NextResponse.json({ message: 'Roaster not found' }, { status: 404 })
  }

  return NextResponse.json(roaster, { headers: publicCacheHeaders(SHOP_DATA_TTL) })
}
