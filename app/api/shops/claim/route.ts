import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'
import { metrics } from '@/lib/metrics'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// A claim targets exactly one entity. Each type maps to the table we validate the
// target against and the claims column the id lands in.
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

  // Every target id (shop uuid, company id, roaster id) is a uuid. A non-uuid is
  // bad client input — reject it before querying so it 400s rather than surfacing
  // as a DB error / apiError 500.
  if (!UUID_RE.test(target_id)) {
    return NextResponse.json({ error: 'Invalid target id' }, { status: 400 })
  }

  // Validate that the entity being claimed actually exists. For a shop or roaster
  // also pull its company_id so ownership resolution is enforced here, not just in
  // the page — a company owns its shops and roaster, so a company-owned target is
  // claimed against the company. A company has no company_id to roll up to.
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

  // Log only non-PII identifiers — contact_name/business_email would ship to Loki.
  // Use the resolved type/id so a company-owned shop counts as a company claim.
  logger.info('Claim submitted', { claim_type: persistedType, target_id: persistedId })
  metrics.claimSubmitted(persistedType)
  // Return a minimal, stable payload rather than echoing the insert result.
  return NextResponse.json({ ok: true }, { status: 201 })
}
