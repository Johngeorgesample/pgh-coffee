import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { metrics } from '@/lib/metrics'
import { AMENITY_KEYS } from '@/lib/amenityKeys'
import { isRealSupabaseError } from '@/lib/supabaseErrors'
import { getClient } from '@/lib/supabase/server-client'

export async function POST(request: Request) {
  const { shop_id, amenities } = await request.json()

  if (!shop_id || !Array.isArray(amenities)) {
    return NextResponse.json({ error: 'Missing shop_id or amenities' }, { status: 400 })
  }

  if (!amenities.every((amenity) => AMENITY_KEYS.includes(amenity))) {
    return NextResponse.json({ error: 'Invalid amenity value' }, { status: 400 })
  }

  const supabase = getClient()
  const { data: shop, error: shopError } = await supabase
    .from('shops')
    .select('uuid')
    .eq('uuid', shop_id)
    .single()

  if (isRealSupabaseError(shopError)) {
    logger.error('Error validating shop', { error: shopError.message })
    metrics.apiError('shops/report-amenities')
    return NextResponse.json({ error: 'Error validating shop' }, { status: 500 })
  }

  if (!shop) {
    return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('amenity_reports')
    .insert([{ shop_id, amenities }])

  if (error) {
    logger.error('Error submitting amenity report', { error: error.message })
    metrics.apiError('shops/report-amenities')
    return NextResponse.json({ error: 'Error submitting amenity report' }, { status: 500 })
  }

  logger.info('Amenity report submitted', { shop_id })
  metrics.shopAmenityReportSubmitted()
  return NextResponse.json(data, { status: 201 })
}
