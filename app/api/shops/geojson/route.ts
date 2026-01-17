import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { formatDataToGeoJSON } from '../../../utils/utils'

// Cache for 1 hour, revalidate in background
export const revalidate = 3600

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const fetchShops = async () => {
  const { data, error } = await supabase
    .from('shops')
    .select('*, company:company_id(*)')
    .order('name', { ascending: true })
  if (error) {
    console.error('Error fetching shops:', error.message)
    return []
  }
  return data
}


// API Route Handler
export async function GET() {
  const shops = await fetchShops()
  const geojson = formatDataToGeoJSON(shops)

  if (!shops) {
    return NextResponse.json({ error: 'Error creating GeoJSON' }, { status: 500 })
  }

  return NextResponse.json(geojson, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=60',
    },
  })
}
