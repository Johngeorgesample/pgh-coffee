import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { UpdateShopPreferenceRequest } from '@/types/email-preferences-types'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ shopId: string }> }
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { shopId } = await params

  if (!shopId) {
    return NextResponse.json({ error: 'shopId is required' }, { status: 400 })
  }

  const body: UpdateShopPreferenceRequest = await request.json()
  const { subscribed } = body

  if (typeof subscribed !== 'boolean') {
    return NextResponse.json(
      { error: 'subscribed is required' },
      { status: 400 }
    )
  }

  // Validate that the shop exists
  const { data: shop, error: shopError } = await supabase
    .from('shops')
    .select('uuid')
    .eq('uuid', shopId)
    .single()

  if (shopError || !shop) {
    return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
  }

  // Upsert shop preference
  const { data, error } = await supabase
    .from('shop_email_preferences')
    .upsert(
      {
        user_id: user.id,
        shop_id: shopId,
        subscribed,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,shop_id' }
    )
    .select()
    .single()

  if (error) {
    console.error('Error updating shop preference:', error.message)
    return NextResponse.json(
      { error: 'Error updating shop preference' },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}
