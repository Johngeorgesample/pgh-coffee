import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { metrics } from '@/lib/metrics'

const MAX_SHOP_UUIDS = 1000

type Supabase = Awaited<ReturnType<typeof createClient>>
type KnownShop = { uuid: string; neighborhood: string }

async function findKnownShops(supabase: Supabase, shopUUIDs: unknown[]) {
  const requested = new Set(shopUUIDs)
  const { data, error } = await supabase.from('shops').select('uuid, neighborhood')
  return { data: data?.filter((shop) => requested.has(shop.uuid)), error }
}

const isShopUUIDList = (value: unknown): value is unknown[] =>
  Array.isArray(value) && value.length <= MAX_SHOP_UUIDS

function countByNeighborhood(visits: { shop_id: string }[], shops: KnownShop[]) {
  const neighborhoods = new Map(shops.map((shop) => [shop.uuid, shop.neighborhood]))
  const counts = new Map<string, number>()
  visits.forEach(({ shop_id }) => {
    const neighborhood = neighborhoods.get(shop_id) ?? ''
    counts.set(neighborhood, (counts.get(neighborhood) ?? 0) + 1)
  })
  return counts
}

function recordVisitsAdded(
  visits: { shop_id: string }[],
  shops: KnownShop[],
  userID: string,
) {
  countByNeighborhood(visits, shops).forEach((count, neighborhood) => metrics.visitAdded(neighborhood, count))
  logger.info('Added visits', { count: String(visits.length), userID })
}

const badRequest = (error: string) => NextResponse.json({ error }, { status: 400 })

function addVisitsFailed(message: string, error: { message: string }) {
  logger.error(message, { error: error.message })
  return NextResponse.json({ error: 'Error adding visits' }, { status: 500 })
}

const insertVisits = (supabase: Supabase, userID: string, shops: KnownShop[]) =>
  supabase
    .from('user_visits')
    .upsert(
      shops.map((shop) => ({ user_id: userID, shop_id: shop.uuid })),
      { onConflict: 'user_id,shop_id', ignoreDuplicates: true }
    )
    .select()

async function saveVisits(supabase: Supabase, userID: string, shops: KnownShop[]) {
  const { data, error } = await insertVisits(supabase, userID, shops)
  if (error) return addVisitsFailed('Error adding visits', error)
  recordVisitsAdded(data, shops, userID)
  return NextResponse.json(data, { status: 201 })
}

async function addVisits(supabase: Supabase, userID: string, shopUUIDs: unknown) {
  if (!isShopUUIDList(shopUUIDs)) return badRequest(`shopUUIDs must be an array of at most ${MAX_SHOP_UUIDS} shop UUIDs`)
  const { data: shops, error } = await findKnownShops(supabase, shopUUIDs)
  if (error) return addVisitsFailed('Error looking up shops for visits', error)
  if (!shops?.length) return badRequest('shopUUIDs must include at least one known shop')
  return saveVisits(supabase, userID, shops)
}

export async function GET() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const { data, error } = await supabase
    .from('user_visits')
    .select(`
      id,
      created_at,
      shop:shops (*, company:company_id (*))
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    logger.error('Error fetching visits', { error: error.message })
    return NextResponse.json(
      { error: 'Error fetching visits' },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const { shopUUID, shopUUIDs } = await request.json()

  if (shopUUIDs === undefined && !shopUUID) {
    return NextResponse.json(
      { error: 'shopUUID is required' },
      { status: 400 }
    )
  }

  return addVisits(supabase, user.id, shopUUIDs ?? [shopUUID])
}

export async function DELETE(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const { shopUUID } = await request.json()

  if (!shopUUID) {
    return NextResponse.json(
      { error: 'shopUUID is required' },
      { status: 400 }
    )
  }

  const { error } = await supabase
    .from('user_visits')
    .delete()
    .eq('user_id', user.id)
    .eq('shop_id', shopUUID)

  if (error) {
    logger.error('Error removing visit', { error: error.message })
    return NextResponse.json(
      { error: 'Error removing visit' },
      { status: 500 }
    )
  }

  logger.info('Removed visit', { shopUUID, userID: user.id })
  metrics.visitRemoved()
  return NextResponse.json({ success: true })
}
