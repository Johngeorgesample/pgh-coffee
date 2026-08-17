import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { visibleEvents } from '@/app/utils/events'

const fetchEvents = async (shopID?: string, roasterID?: string) => {
  let query = visibleEvents()
    .order('event_date', { ascending: false })

  if (shopID) {
    query = query.eq('shop_id', shopID)
  }

  if (roasterID) {
    query = query.eq('roaster_id', roasterID)
  }

  const { data, error } = await query

  if (error) {
    logger.error('Error fetching events', { error: error.message })
    return null
  }

  return data
}

// API Route Handler
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const shopID = searchParams.get('shop_id') ?? ''
  const roasterID = searchParams.get('roaster_id') ?? ''

  const events = await fetchEvents(shopID, roasterID)

  if (!events) {
    return NextResponse.json({ error: 'Error fetching events' }, { status: 500 })
  }

  // No shared-CDN cache: this response varies by the shop_id/roaster_id query
  // string, but the CDN keys its cache on the path alone, so a cached copy
  // would be served across different filters (every shop showing every event).
  return NextResponse.json(events)
}
