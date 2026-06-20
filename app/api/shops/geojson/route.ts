import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { formatDataToGeoJSON } from '../../../utils/utils'
import { logger } from '@/lib/logger'
import { withMetrics } from '@/lib/withMetrics'
import { publicCacheHeaders, SHOP_DATA_TTL } from '@/lib/cacheHeaders'

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
    return null
  }
  return data
}


export const GET = withMetrics('shops/geojson', async () => {
  const shops = await fetchShops()

  // A DB failure must return an uncacheable error, not a 200 empty map that the
  // CDN would pin for the full TTL — turning a transient outage into "no shops"
  // for every user.
  if (!shops) {
    return NextResponse.json({ error: 'Error fetching shops' }, { status: 500 })
  }

  const geojson = formatDataToGeoJSON(shops)
  return NextResponse.json(geojson, { headers: publicCacheHeaders(SHOP_DATA_TTL) })
})
