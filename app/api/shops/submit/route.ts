import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'
import { metrics } from '@/lib/metrics'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: Request) {
  const { name, address, neighborhood, website } = await request.json()

  if (!name || !address) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('moderation')
    .insert([{ name, address, neighborhood, website }])

  if (error) {
    logger.error('Error adding shop', { error: error.message })
    metrics.apiError('shops/submit')
    return NextResponse.json({ error: 'Error adding shop' }, { status: 500 })
  }

  logger.info('Shop submitted', { name, address, neighborhood, website })
  metrics.shopSubmitted()
  return NextResponse.json(data, { status: 201 })
}
