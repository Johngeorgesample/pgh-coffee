import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { metrics } from '@/lib/metrics'

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
      shop:shops (*)
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

  const { shopUUID } = await request.json()

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
