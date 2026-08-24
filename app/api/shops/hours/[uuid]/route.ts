import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { withMetrics } from '@/lib/withMetrics'
import { publicCacheHeaders, SHOP_DATA_TTL } from '@/lib/cacheHeaders'
import { getClient } from '@/lib/supabase/server-client'

// A present day-row means open
// A missing day means closed
// Zero rows means we have no schedule to show
export const GET = withMetrics(
  'shops/hours/[uuid]',
  async (_req: NextRequest, props: { params: Promise<{ uuid: string }> }) => {
    const { uuid } = await props.params

    const { data, error } = await getClient()
      .from('shop_hours')
      .select('day_of_week, opens_at, closes_at, spans_midnight')
      .eq('shop_uuid', uuid)
      .order('day_of_week', { ascending: true })
      .order('opens_at', { ascending: true })

    if (error) {
      logger.error('Error fetching shop hours', { error: error.message })
      return NextResponse.json({ message: 'Error fetching shop hours' }, { status: 500 })
    }

    return NextResponse.json(data ?? [], { headers: publicCacheHeaders(SHOP_DATA_TTL) })
  },
)
