import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export interface NeighborhoodProgress {
  neighborhood: string
  total: number
  visited: number
}

export interface VisitsProgress {
  total: number
  visited: number
  byNeighborhood: NeighborhoodProgress[]
}

// Counts shop neighborhoods in JS — PostgREST GROUP BY / aggregates are not
// enabled on a stock Supabase project, so we tally the raw neighborhood column.
// Shops with a null neighborhood still count toward `total`/`visited`, but are
// not given their own row in `byNeighborhood` (so the per-neighborhood rows may
// not sum to `total`).
function tally(rows: { neighborhood: string | null }[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const { neighborhood } of rows) {
    if (!neighborhood) continue
    counts.set(neighborhood, (counts.get(neighborhood) ?? 0) + 1)
  }
  return counts
}

export async function GET() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // All shops (the denominator). The shops table is the live published set —
  // submissions go to the separate `moderation` table, so no status filter.
  const { data: shops, error: shopsError } = await supabase
    .from('shops')
    .select('neighborhood')

  if (shopsError || !shops) {
    logger.error('Error fetching shops for visit progress', { error: shopsError?.message })
    return NextResponse.json({ error: 'Error fetching progress' }, { status: 500 })
  }

  // This user's visits, with each visited shop's neighborhood.
  const { data: visits, error: visitsError } = await supabase
    .from('user_visits')
    .select('shop:shops (neighborhood)')
    .eq('user_id', user.id)

  if (visitsError || !visits) {
    logger.error('Error fetching visits for visit progress', { error: visitsError?.message })
    return NextResponse.json({ error: 'Error fetching progress' }, { status: 500 })
  }

  // Supabase types the embedded relation as an array; shop_id is a single FK so
  // it resolves to one shop. Normalize both shapes to a flat neighborhood list.
  const visitRows = visits.map((v) => {
    const shop = Array.isArray(v.shop) ? v.shop[0] : v.shop
    return { neighborhood: (shop?.neighborhood as string | null) ?? null }
  })

  const shopCounts = tally(shops as { neighborhood: string | null }[])
  const visitCounts = tally(visitRows)

  const byNeighborhood: NeighborhoodProgress[] = Array.from(shopCounts.entries())
    .map(([neighborhood, total]) => ({
      neighborhood,
      total,
      visited: visitCounts.get(neighborhood) ?? 0,
    }))
    .sort((a, b) => a.neighborhood.localeCompare(b.neighborhood))

  const progress: VisitsProgress = {
    total: shops.length,
    visited: visits.length,
    byNeighborhood,
  }

  return NextResponse.json(progress)
}
