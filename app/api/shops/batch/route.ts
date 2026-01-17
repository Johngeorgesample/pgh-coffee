import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { formatDataToGeoJSON } from '../../../utils/utils'

// Cache for 1 hour, revalidate in background
export const revalidate = 3600

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const fetchShopsByIds = async (ids: string[]) => {
  const { data, error } = await supabase
    .from('shops')
    .select('*, company:company_id(*)')
    .in('uuid', ids)
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching shops by IDs:', error.message)
    return null
  }
  return data
}

// API Route Handler
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const idsParam = searchParams.get('ids')

  if (!idsParam) {
    return NextResponse.json(
      { error: 'Missing ids parameter' },
      { status: 400 }
    )
  }

  const ids = idsParam.split(',').map(id => id.trim()).filter(id => id.length > 0)

  if (ids.length === 0) {
    return NextResponse.json([])
  }

  const shops = await fetchShopsByIds(ids)

  if (shops === null) {
    return NextResponse.json(
      { error: 'Error fetching shops' },
      { status: 500 }
    )
  }

  const geojson = formatDataToGeoJSON(shops)
  return NextResponse.json(geojson, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=60',
    },
  })
}
