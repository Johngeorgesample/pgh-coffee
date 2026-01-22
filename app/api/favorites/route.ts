import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
    .from('user_favorites')
    .select(`
      id,
      created_at,
      shop:shops (*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching favorites:', error.message)
    return NextResponse.json(
      { error: 'Error fetching favorites' },
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
    .select('uuid')
    .eq('uuid', shopUUID)
    .single()

  if (shopError || !shop) {
    return NextResponse.json(
      { error: 'Shop not found' },
      { status: 404 }
    )
  }

  const { data, error } = await supabase
    .from('user_favorites')
    .insert({ user_id: user.id, shop_id: shopUUID })
    .select()
    .single()

  if (error) {
    console.error('Error adding favorite:', error.message)
    return NextResponse.json(
      { error: 'Error adding favorite' },
      { status: 500 }
    )
  }

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
    .from('user_favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('shop_id', shopUUID)

  if (error) {
    console.error('Error removing favorite:', error.message)
    return NextResponse.json(
      { error: 'Error removing favorite' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
