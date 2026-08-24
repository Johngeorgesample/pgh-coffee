import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { withMetrics } from '@/lib/withMetrics'
import { SHOP_WITH_ROASTER_SELECT } from '@/app/utils/utils'
import { getClient } from '@/lib/supabase/server-client'

const fetchShops = async (neighborhood?: string) => {
  let query = getClient().from('shops').select(SHOP_WITH_ROASTER_SELECT).order('name', { ascending: true })

  if (neighborhood) {
    query = query.eq('neighborhood', neighborhood)
  }

  const { data, error } = await query
  if (error) {
    logger.error('Error fetching shops', { error: error.message })
    return null
  }
  return data
}

export const GET = withMetrics('shops', async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const neighborhood = searchParams.get('neighborhood') ?? ''

  const shops = await fetchShops(neighborhood)

  if (!shops) {
    return NextResponse.json({ error: 'Error fetching shops' }, { status: 500 })
  }

  return NextResponse.json(shops)
})
