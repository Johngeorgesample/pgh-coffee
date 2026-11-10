import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { metrics } from '@/lib/metrics'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type Supabase = Awaited<ReturnType<typeof createClient>>

async function findKnownShops(supabase: Supabase, shopUUIDs: unknown) {
  const candidates = Array.isArray(shopUUIDs)
    ? shopUUIDs.filter((uuid) => typeof uuid === 'string' && UUID_RE.test(uuid))
    : []
  if (candidates.length === 0) return []

  const { data } = await supabase.from('shops').select('uuid, neighborhood').in('uuid', candidates)
  return data ?? []
}

function recordVisitsAdded(
  visits: { shop_id: string }[],
  shops: { uuid: string; neighborhood: string }[],
  userID: string,
) {
  const neighborhoods = new Map(shops.map((shop) => [shop.uuid, shop.neighborhood]))
  visits.forEach((visit) => metrics.visitAdded(neighborhoods.get(visit.shop_id) ?? ''))
  logger.info('Added visits', { count: String(visits.length), userID })
}

async function addVisits(supabase: Supabase, userID: string, shopUUIDs: unknown) {
  const shops = await findKnownShops(supabase, shopUUIDs)

  if (shops.length === 0) {
    return NextResponse.json(
      { error: 'shopUUIDs must include at least one known shop' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('user_visits')
    .upsert(
      shops.map((shop) => ({ user_id: userID, shop_id: shop.uuid })),
      { onConflict: 'user_id,shop_id', ignoreDuplicates: true }
    )
    .select()

  if (error) {
    logger.error('Error adding visits', { error: error.message })
    return NextResponse.json(
      { error: 'Error adding visits' },
      { status: 500 }
    )
  }

  recordVisitsAdded(data, shops, userID)
  return NextResponse.json(data, { status: 201 })
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

  if (shopUUIDs !== undefined) return addVisits(supabase, user.id, shopUUIDs)

  if (!shopUUID) {
    return NextResponse.json(
      { error: 'shopUUID is required' },
      { status: 400 }
    )
  }

  // Validate that the shop exists
  const { data: shop, error: shopError } = await supabase
    .from('shops')
    .select('uuid, name, neighborhood')
    .eq('uuid', shopUUID)
    .single()

  if (shopError || !shop) {
    return NextResponse.json(
      { error: 'Shop not found' },
      { status: 404 }
    )
  }

  const { data, error } = await supabase
    .from('user_visits')
    .insert({ user_id: user.id, shop_id: shopUUID })
    .select()
    .single()

  if (error) {
    logger.error('Error adding visit', { error: error.message })
    return NextResponse.json(
      { error: 'Error adding visit' },
      { status: 500 }
    )
  }

  logger.info('Added visit', { shopUUID, shopName: shop.name, userID: user.id })
  metrics.visitAdded(shop.neighborhood)
  return NextResponse.json(data, { status: 201 })
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
