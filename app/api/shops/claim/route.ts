import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'
import { metrics } from '@/lib/metrics'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function POST(request: Request) {
  const body = await request.json()
  const { shop_id, contact_name, role, business_email, phone, social_media, message } = body

  if (!shop_id || !contact_name || !business_email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // A non-uuid shop_id is bad client input, not a server error — reject it before
  // querying so it 400s rather than surfacing as a DB error / apiError 500.
  if (!UUID_RE.test(shop_id)) {
    return NextResponse.json({ error: 'Invalid shop id' }, { status: 400 })
  }

  // Validate that the shop being claimed actually exists
  const { data: shop, error: shopError } = await supabase
    .from('shops')
    .select('uuid')
    .eq('uuid', shop_id)
    .single()

  // PGRST116 is "no rows" — a genuine 404. Any other error is a real failure
  // (DB down, bad query) and must not masquerade as "shop not found".
  if (shopError && shopError.code !== 'PGRST116') {
    logger.error('Error validating shop for claim', { error: shopError.message })
    metrics.apiError('shops/claim')
    return NextResponse.json({ error: 'Error submitting claim' }, { status: 500 })
  }

  if (!shop) {
    return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
  }

  const { error } = await supabase
    .from('shop_claims')
    .insert([{
      shop_id,
      contact_name,
      role,
      business_email,
      phone,
      social_media,
      message,
      status: 'pending',
    }])

  if (error) {
    logger.error('Error submitting claim', { error: error.message })
    metrics.apiError('shops/claim')
    return NextResponse.json({ error: 'Error submitting claim' }, { status: 500 })
  }

  // Log only the shop_id — contact_name/business_email are PII and would ship to Loki.
  logger.info('Shop claim submitted', { shop_id })
  metrics.shopClaimSubmitted()
  // Return a minimal, stable payload rather than echoing the insert result.
  return NextResponse.json({ ok: true }, { status: 201 })
}
