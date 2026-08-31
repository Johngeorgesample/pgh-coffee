import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { isRealSupabaseError } from '@/lib/supabaseErrors'

interface ToggleRouteConfig {
  table: 'user_favorites' | 'user_visits'
  label: string
  onAdded: (neighborhood: string) => void
  onRemoved: () => void
}

const unauthorized = () => NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

async function requireUser(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// A missing shop is a legitimate 404 (PGRST116 from .single()); anything else
// is an outage and must surface as a 500, not masquerade as "not found" —
// callers branch on `dbError` before falling back to the not-found case.
async function validateShop(supabase: Awaited<ReturnType<typeof createClient>>, shopUUID: string) {
  const { data: shop, error } = await supabase
    .from('shops')
    .select('uuid, name, neighborhood')
    .eq('uuid', shopUUID)
    .single()

  if (isRealSupabaseError(error)) return { shop: null, dbError: error }
  return { shop: shop ?? null, dbError: null }
}

async function parseShopUUID(request: Request) {
  const { shopUUID } = await request.json()
  return (shopUUID as string | undefined) ?? null
}

/**
 * Favorites and visits are distinct concepts (separate tables, separate
 * metrics) but were toggled by two line-for-line identical route handlers;
 * this factory parameterizes the one mechanism they share.
 */
export function createToggleRoute({ table, label, onAdded, onRemoved }: ToggleRouteConfig) {
  const GET = async () => {
    const supabase = await createClient()
    const user = await requireUser(supabase)
    if (!user) return unauthorized()

    const { data, error } = await supabase
      .from(table)
      .select('id, created_at, shop:shops (*, company:company_id (*))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      logger.error(`Error fetching ${label}s`, { error: error.message })
      return NextResponse.json({ error: `Error fetching ${label}s` }, { status: 500 })
    }

    return NextResponse.json(data)
  }

  const POST = async (request: Request) => {
    const supabase = await createClient()
    const user = await requireUser(supabase)
    if (!user) return unauthorized()

    const shopUUID = await parseShopUUID(request)
    if (!shopUUID) return NextResponse.json({ error: 'shopUUID is required' }, { status: 400 })

    const { shop, dbError } = await validateShop(supabase, shopUUID)
    if (dbError) {
      logger.error(`Error validating ${label} target`, { error: dbError.message })
      return NextResponse.json({ error: `Error adding ${label}` }, { status: 500 })
    }
    if (!shop) return NextResponse.json({ error: 'Shop not found' }, { status: 404 })

    const { data, error } = await supabase
      .from(table)
      .insert({ user_id: user.id, shop_id: shopUUID })
      .select()
      .single()

    if (error) {
      logger.error(`Error adding ${label}`, { error: error.message })
      return NextResponse.json({ error: `Error adding ${label}` }, { status: 500 })
    }

    logger.info(`Added ${label}`, { shopUUID, shopName: shop.name, userID: user.id })
    onAdded(shop.neighborhood)
    return NextResponse.json(data, { status: 201 })
  }

  const DELETE = async (request: Request) => {
    const supabase = await createClient()
    const user = await requireUser(supabase)
    if (!user) return unauthorized()

    const shopUUID = await parseShopUUID(request)
    if (!shopUUID) return NextResponse.json({ error: 'shopUUID is required' }, { status: 400 })

    const { error } = await supabase
      .from(table)
      .delete()
      .eq('user_id', user.id)
      .eq('shop_id', shopUUID)

    if (error) {
      logger.error(`Error removing ${label}`, { error: error.message })
      return NextResponse.json({ error: `Error removing ${label}` }, { status: 500 })
    }

    logger.info(`Removed ${label}`, { shopUUID, userID: user.id })
    onRemoved()
    return NextResponse.json({ success: true })
  }

  return { GET, POST, DELETE }
}
