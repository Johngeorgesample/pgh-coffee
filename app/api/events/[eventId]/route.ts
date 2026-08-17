import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { visibleEvents } from '@/app/utils/events'

const getEvent = async (eventId: string) => {
  const { data, error } = await visibleEvents()
    .eq('id', eventId)
    .single()

  if (error) {
    logger.error('Error fetching event', { error: error.message })
    return null
  }

  return data
}

export async function GET(req: NextRequest, props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params
  const { eventId } = params

  const event = await getEvent(eventId)

  if (event === null) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

  return NextResponse.json(event)
}
