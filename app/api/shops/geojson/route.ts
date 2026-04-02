import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { formatDataToGeoJSON } from '../../../utils/utils'
import { logger } from '@/lib/logger'
import { withMetrics } from '@/lib/withMetrics'

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
    logger.error('Error fetching shops', { error: error.message })
    return []
  }
  return data
}


export const GET = withMetrics('shops/geojson', async () => {
  const shops = await fetchShops()
  const geojson = formatDataToGeoJSON(shops)

  if (!shops) {
    return NextResponse.json({ error: 'Error creating GeoJSON' }, { status: 500 })
  }

  return NextResponse.json(geojson)
})
