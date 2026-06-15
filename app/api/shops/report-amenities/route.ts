import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'
import { metrics } from '@/lib/metrics'
import { AMENITY_KEYS } from '@/lib/amenities'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: Request) {
  const { shop_id, amenities } = await request.json()

  if (!shop_id || !Array.isArray(amenities)) {
    return NextResponse.json({ error: 'Missing shop_id or amenities' }, { status: 400 })
  }

  if (!amenities.every((amenity) => AMENITY_KEYS.includes(amenity))) {
    return NextResponse.json({ error: 'Invalid amenity value' }, { status: 400 })
  }

  const { data: shop, error: shopError } = await supabase
    .from('shops')
    .select('uuid')
    .eq('uuid', shop_id)
    .single()

  if (shopError || !shop) {
    return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('amenity_reports')
    .insert([{ shop_id, amenities }])

  if (error) {
    logger.error('Error submitting amenity report', { error: error.message })
    return NextResponse.json({ error: 'Error submitting amenity report' }, { status: 500 })
  }

  logger.info('Amenity report submitted', { shop_id })
  metrics.shopAmenityReportSubmitted()
  return NextResponse.json(data, { status: 201 })
}
