import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'
import { metrics } from '@/lib/metrics'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: Request) {
  const body = await request.json()
  const { shop_id, reported_name, reported_address, reported_neighborhood, reported_website } = body

  if (!shop_id) {
    return NextResponse.json({ error: 'Missing shop_id' }, { status: 400 })
  }

  // Validate that the shop exists
  const { data: shop, error: shopError } = await supabase
    .from('shops')
    .select('uuid')
    .eq('uuid', shop_id)
    .single()

  if (shopError || !shop) {
    return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('shop_reports')
    .insert([{
      shop_id,
      reported_name,
      reported_address,
      reported_neighborhood,
      reported_website,
    }])

  if (error) {
    logger.error('Error submitting report', { error: error.message })
    metrics.apiError('shops/report')
    return NextResponse.json({ error: 'Error submitting report' }, { status: 500 })
  }

  logger.info('Shop report submitted', { shop_id, reported_name, reported_address, reported_neighborhood, reported_website })
  metrics.shopReportSubmitted()
  return NextResponse.json(data, { status: 201 })
}
