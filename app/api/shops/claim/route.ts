import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'
import { metrics } from '@/lib/metrics'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: Request) {
  const body = await request.json()
  const { shop_id, contact_name, role, business_email, phone, message } = body

  if (!shop_id || !contact_name || !business_email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Validate that the shop being claimed actually exists
  const { data: shop, error: shopError } = await supabase
    .from('shops')
    .select('uuid')
    .eq('uuid', shop_id)
    .single()

  if (shopError || !shop) {
    return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('shop_claims')
    .insert([{
      shop_id,
      contact_name,
      role,
      business_email,
      phone,
      message,
      status: 'pending',
    }])

  if (error) {
    logger.error('Error submitting claim', { error: error.message })
    metrics.apiError('shops/claim')
    return NextResponse.json({ error: 'Error submitting claim' }, { status: 500 })
  }

  logger.info('Shop claim submitted', { shop_id, contact_name, business_email })
  metrics.shopClaimSubmitted()
  return NextResponse.json(data, { status: 201 })
}
