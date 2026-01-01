import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const fetchUpdates = async (shopID?: string) => {
  let query = supabase
    .from('updates')
    .select('*, shop:shops(*)')
    .order('post_date', { ascending: false })

  if (shopID) {
    query = query.eq('shop_id', shopID)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching updates:', error.message)
    return null
  }

  return data
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const shopID = searchParams.get('shop_id') ?? ''
  const updates = await fetchUpdates(shopID)

  if (!updates) {
    return NextResponse.json({ error: 'Error fetching updates' }, { status: 500 })
  }

  return NextResponse.json(updates)
}
