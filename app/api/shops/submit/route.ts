import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { metrics } from '@/lib/metrics'
import { getClient } from '@/lib/supabase/server-client'

export async function POST(request: Request) {
  const { name, address, neighborhood, website } = await request.json()

  if (!name || !address) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data, error } = await getClient()
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
