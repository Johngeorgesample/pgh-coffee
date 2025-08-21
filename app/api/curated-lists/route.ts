import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const mapDbShopToTShop = (s: any) => {
  if (s.latitude == null || s.longitude == null) return null
  return {
    type: 'Feature',
    properties: {
      name: s.name,
      neighborhood: s.neighborhood,
      address: s.address,
      photo: s.photo ?? undefined,
      website: s.website,
      uuid: s.uuid,
    },
    geometry: {
      type: 'Point',
      coordinates: [s.longitude, s.latitude], // NOTE: [lng, lat]
    },
  }
}

const fetchCuratedLists = async () => {
  const { data, error } = await supabase
    .from('curated_lists_with_shops')
    .select('*')
    .order('title', { ascending: true })

  if (error) {
    console.error('Error fetching curated lists:', error.message)
    return null
  }

  const lists = (data).map((list) => {
    const shops = (list.shops || [])
      .map(mapDbShopToTShop)
      .filter((s: any) => s !== null)

    return { ...list, shops }
  })

  return lists
}

// API Route Handler
export async function GET() {
  const lists = await fetchCuratedLists()

  if (!lists) {
    return NextResponse.json({ error: 'Error fetching curated lists' }, { status: 500 })
  }

  return NextResponse.json(lists)
}
