import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const fetchEvents = async (shopID?: string, roasterID?: string) => {
  let query = supabase
    .from('events')
    .select('*, shop:shop_id(*, company:company_id(*)), roaster:roaster_id(*)')
    .order('event_date', { ascending: false })

  if (shopID) {
    query = query.eq('shop_id', shopID)
  }

  if (roasterID) {
    query = query.eq('roaster_id', roasterID)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching events:', error.message)
    return null
  }

  return data
}

// API Route Handler
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const shopID = searchParams.get('shop_id') ?? ''
  const roasterID = searchParams.get('roaster_id') ?? ''

  const events = await fetchEvents(shopID, roasterID)

  if (!events) {
    return NextResponse.json({ error: 'Error fetching events' }, { status: 500 })
  }

  return NextResponse.json(events)
}
