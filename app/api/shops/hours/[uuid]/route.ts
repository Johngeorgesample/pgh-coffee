import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'
import { withMetrics } from '@/lib/withMetrics'
import { publicCacheHeaders, SHOP_DATA_TTL } from '@/lib/cacheHeaders'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Reads only shop_hours: it's the sole hours table with a public-read RLS policy.
// shop_hours_meta is admin-only (no policies), so the anon key can't see it — and
// the display needs nothing from it. A present day-row means open then; a missing
// day means closed; zero rows means we have no schedule to show.
export const GET = withMetrics(
  'shops/hours/[uuid]',
  async (_req: NextRequest, props: { params: Promise<{ uuid: string }> }) => {
    const { uuid } = await props.params

    const { data, error } = await supabase
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
