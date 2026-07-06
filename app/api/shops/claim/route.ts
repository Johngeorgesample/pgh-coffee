import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'
import { metrics } from '@/lib/metrics'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// A claim targets exactly one entity. Each type maps to the table we validate the
// target against and the claims column the id lands in.
const TARGETS = {
  shop: { table: 'shops', idColumn: 'uuid', fkColumn: 'shop_id' },
  company: { table: 'companies', idColumn: 'id', fkColumn: 'company_id' },
  roaster: { table: 'roaster', idColumn: 'id', fkColumn: 'roaster_id' },
} as const

export async function POST(request: Request) {
  const body = await request.json()
  const { claim_type, target_id, contact_name, role, business_email, phone, social_media, message } = body

  const target = TARGETS[claim_type as keyof typeof TARGETS]
  if (!target || !target_id || !contact_name || !business_email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Validate that the entity being claimed actually exists.
  const { data: entity, error: entityError } = await supabase
    .from(target.table)
    .select(target.idColumn)
    .eq(target.idColumn, target_id)
    .single()

  if (entityError || !entity) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('claims')
    .insert([{
      [target.fkColumn]: target_id,
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

  logger.info('Claim submitted', { claim_type, target_id, contact_name, business_email })
  metrics.claimSubmitted()
  return NextResponse.json(data, { status: 201 })
}
