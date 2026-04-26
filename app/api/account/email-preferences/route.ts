import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type {
  EmailPreferencesResponse,
  UpdateGlobalPreferencesRequest,
} from '@/types/email-preferences-types'

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch global preferences
  const { data: globalPrefs, error: globalError } = await supabase
    .from('email_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (globalError && globalError.code !== 'PGRST116') {
    console.error('Error fetching global preferences:', globalError.message)
    return NextResponse.json(
      { error: 'Error fetching preferences' },
      { status: 500 }
    )
  }

  // Fetch shop-specific preferences for user's favorited shops
  const { data: shopPrefs, error: shopError } = await supabase
    .from('shop_email_preferences')
    .select(
      `
      id,
      user_id,
      shop_id,
      subscribed,
      created_at,
      updated_at,
      shop:shops (uuid, name, neighborhood)
    `
    )
    .eq('user_id', user.id)

  if (shopError) {
    console.error('Error fetching shop preferences:', shopError.message)
    return NextResponse.json(
      { error: 'Error fetching shop preferences' },
      { status: 500 }
    )
  }

  // Transform the shop data from Supabase's array format to our expected format
  const transformedShopPrefs = (shopPrefs || []).map((pref) => ({
    ...pref,
    shop: Array.isArray(pref.shop) ? pref.shop[0] : pref.shop,
  }))

  const response: EmailPreferencesResponse = {
    global: globalPrefs || null,
    shops: transformedShopPrefs,
  }

  return NextResponse.json(response)
}

export async function PUT(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body: UpdateGlobalPreferencesRequest = await request.json()

  const { notifications_enabled, notification_frequency, notification_types } =
    body

  if (typeof notifications_enabled !== 'boolean') {
    return NextResponse.json(
      { error: 'notifications_enabled is required' },
      { status: 400 }
    )
  }

  const validFrequencies = ['immediate', 'daily', 'weekly']
  if (!validFrequencies.includes(notification_frequency)) {
    return NextResponse.json(
      { error: 'Invalid notification_frequency' },
      { status: 400 }
    )
  }

  const validTypes = ['news', 'events', 'promotions', 'new_locations']
  if (
    !Array.isArray(notification_types) ||
    !notification_types.every((t) => validTypes.includes(t))
  ) {
    return NextResponse.json(
      { error: 'Invalid notification_types' },
      { status: 400 }
    )
  }

  // Upsert global preferences
  const { data, error } = await supabase
    .from('email_preferences')
    .upsert(
      {
        user_id: user.id,
        notifications_enabled,
        notification_frequency,
        notification_types,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )
    .select()
    .single()

  if (error) {
    console.error('Error updating preferences:', error.message)
    return NextResponse.json(
      { error: 'Error updating preferences' },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}
