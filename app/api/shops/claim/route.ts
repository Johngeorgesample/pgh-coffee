import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'
import { metrics } from '@/lib/metrics'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const TARGETS = {
  shop: { table: 'shops', idColumn: 'uuid', fkColumn: 'shop_id' },
  company: { table: 'companies', idColumn: 'id', fkColumn: 'company_id' },
  roaster: { table: 'roaster', idColumn: 'id', fkColumn: 'roaster_id' },
} as const

export async function POST(request: Request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { claim_type, target_id, contact_name, role, business_email, phone, social_media, message } = body

  const target = TARGETS[claim_type as keyof typeof TARGETS]
  if (!target) {
    return NextResponse.json({ error: 'Invalid or missing claim type' }, { status: 400 })
  }
  if (!target_id || !contact_name || !business_email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (!UUID_RE.test(target_id)) {
    return NextResponse.json({ error: 'Invalid target id' }, { status: 400 })
  }

  const selectColumns = claim_type === 'company' ? target.idColumn : `${target.idColumn}, company_id`
  const { data: entity, error: entityError } = await supabase
    .from(target.table)
    .select(selectColumns)
    .eq(target.idColumn, target_id)
    .single()

  // PGRST116 is "no rows" — a genuine 404. Any other error is a real failure
  // (DB down, bad query) and must not masquerade as "listing not found".
  if (entityError && entityError.code !== 'PGRST116') {
    logger.error('Error validating claim target', { error: entityError.message })
    metrics.apiError('shops/claim')
    return NextResponse.json({ error: 'Error submitting claim' }, { status: 500 })
  }

  if (!entity) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  // Resolve up the ownership tree: a company-owned shop/roaster is persisted against
  // company_id, so a direct API call can't record a leaf claim the page would have
  // rolled up. Only a company-less shop/roaster stays a leaf claim.
  const ownerCompanyId = (entity as { company_id?: string | null }).company_id
  let persistedType = claim_type as keyof typeof TARGETS
  let persistedColumn: string = target.fkColumn
  let persistedId: string = target_id
  if ((claim_type === 'shop' || claim_type === 'roaster') && ownerCompanyId) {
    persistedType = 'company'
    persistedColumn = 'company_id'
    persistedId = ownerCompanyId
  }

  const { error } = await supabase
    .from('claims')
    .insert([{
      [persistedColumn]: persistedId,
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

  logger.info('Claim submitted', { claim_type: persistedType, target_id: persistedId })
  metrics.claimSubmitted(persistedType)
  return NextResponse.json({ ok: true }, { status: 201 })
}
