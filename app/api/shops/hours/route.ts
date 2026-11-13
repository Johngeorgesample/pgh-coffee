import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { withMetrics } from '@/lib/withMetrics'
import { publicCacheHeaders, SHOP_DATA_TTL } from '@/lib/cacheHeaders'
import { getClient } from '@/lib/supabase/server-client'
import type { HoursRow } from '@/app/utils/hours'

const PAGE_SIZE = 1000

type ShopHoursRow = HoursRow & { shop_uuid: string }

const fetchPage = (from: number) =>
  getClient()
    .from('shop_hours')
    .select('shop_uuid, day_of_week, opens_at, closes_at, spans_midnight')
    .order('shop_uuid')
    .order('day_of_week')
    .order('opens_at')
    .range(from, from + PAGE_SIZE - 1)

async function fetchAllRows() {
  const rows: ShopHoursRow[] = []
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await fetchPage(from)
    if (error) return { rows, error }
    rows.push(...data)
    if (data.length < PAGE_SIZE) return { rows, error: null }
  }
}

function groupByShop(rows: ShopHoursRow[]) {
  const hours: Record<string, HoursRow[]> = {}
  rows.forEach(({ shop_uuid, ...row }) => (hours[shop_uuid] ??= []).push(row))
  return hours
}

export const GET = withMetrics('shops/hours', async () => {
  const { rows, error } = await fetchAllRows()
  if (error) {
    logger.error('Error fetching all shop hours', { error: error.message })
    return NextResponse.json({ message: 'Error fetching shop hours' }, { status: 500 })
  }
  return NextResponse.json(groupByShop(rows), { headers: publicCacheHeaders(SHOP_DATA_TTL) })
})
