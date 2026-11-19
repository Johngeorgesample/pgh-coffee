import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { publicCacheHeaders, SHOP_DATA_TTL } from '@/lib/cacheHeaders'
import { getClient } from '@/lib/supabase/server-client'
import { withMetrics } from '@/lib/withMetrics'

const fetchNamed = async (table: 'roaster' | 'companies') => {
  const { data, error } = await getClient().from(table).select('name, slug').order('name')

  if (error) {
    logger.error(`Error fetching ${table} for search`, { error: error.message })
    return null
  }

  return data
}

async function handleGET() {
  const [roasters, companies] = await Promise.all([fetchNamed('roaster'), fetchNamed('companies')])

  if (!roasters || !companies) {
    return NextResponse.json({ error: 'Error fetching search entities' }, { status: 500 })
  }

  return NextResponse.json({ roasters, companies }, { headers: publicCacheHeaders(SHOP_DATA_TTL) })
}

export const GET = withMetrics('search-entities', handleGET)
