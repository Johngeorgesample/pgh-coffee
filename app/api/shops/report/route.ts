import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { metrics } from '@/lib/metrics'
import { REPORT_TYPES, isReportType } from '@/lib/reportTypes'
import { isRealSupabaseError } from '@/lib/supabaseErrors'
import { getClient } from '@/lib/supabase/server-client'

export async function POST(request: Request) {
  const body = await request.json()
  const { shop_id, report_type, details, reported_website } = body

  if (!shop_id) {
    return NextResponse.json({ error: 'Missing shop_id' }, { status: 400 })
  }

  if (!isReportType(report_type)) {
    return NextResponse.json({ error: 'Invalid report_type' }, { status: 400 })
  }

  // Without this the table collects rows that say a shop is wrong but not how.
  const required = REPORT_TYPES[report_type].requires
  if (required && !String(body[required] ?? '').trim()) {
    return NextResponse.json({ error: `Missing ${required}` }, { status: 400 })
  }

  const supabase = getClient()
  // Validate that the shop exists
  const { data: shop, error: shopError } = await supabase
    .from('shops')
    .select('uuid')
    .eq('uuid', shop_id)
    .single()

  if (isRealSupabaseError(shopError)) {
    logger.error('Error validating shop', { error: shopError.message })
    metrics.apiError('shops/report')
    return NextResponse.json({ error: 'Error validating shop' }, { status: 500 })
  }

  if (!shop) {
    return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('shop_reports')
    .insert([{ shop_id, report_type, details, reported_website }])

  if (error) {
    logger.error('Error submitting report', { error: error.message })
    metrics.apiError('shops/report')
    return NextResponse.json({ error: 'Error submitting report' }, { status: 500 })
  }

  logger.info('Shop report submitted', { shop_id, report_type })
  metrics.shopReportSubmitted()
  return NextResponse.json(data, { status: 201 })
}
