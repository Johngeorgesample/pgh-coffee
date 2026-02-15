import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/lists/{list_id}/items - Get all shops in a specific list
export async function GET(_request: NextRequest, props: { params: Promise<{ list_id: string }> }) {
  const params = await props.params
  const { list_id } = params

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify the list belongs to the user
  const { data: list, error: listError } = await supabase
    .from('user_lists')
    .select('id')
    .eq('id', list_id)
    .eq('user_id', user.id)
    .single()

  if (listError || !list) {
    return NextResponse.json({ error: 'List not found' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('user_list_items')
    .select(
      `
      id,
      created_at,
      shop:shops (*)
    `,
    )
    .eq('list_id', list_id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching list items:', error.message)
    return NextResponse.json({ error: 'Error fetching list items' }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST /api/lists/{list_id}/items - Add a shop to a list
export async function POST(request: NextRequest, props: { params: Promise<{ list_id: string }> }) {
  const params = await props.params
  const { list_id } = params

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { shop_id } = await request.json()

  if (!shop_id) {
    return NextResponse.json({ error: 'shop_id is required' }, { status: 400 })
  }

  // Verify the list belongs to the user
  const { data: list, error: listError } = await supabase
    .from('user_lists')
    .select('id')
    .eq('id', list_id)
    .eq('user_id', user.id)
    .single()

  if (listError || !list) {
    return NextResponse.json({ error: 'List not found' }, { status: 404 })
  }

  // Validate that the shop exists
  const { data: shop, error: shopError } = await supabase.from('shops').select('uuid').eq('uuid', shop_id).single()

  if (shopError || !shop) {
    return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('user_list_items')
    .insert({ list_id, shop_id, user_id: user.id })
    .select()
    .single()

  if (error) {
    console.error('Error adding item to list:', error.message)
    return NextResponse.json({ error: 'Error adding item to list' }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
