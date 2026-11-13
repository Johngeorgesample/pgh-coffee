import { NextRequest, NextResponse } from 'next/server'
import { extractUuidPrefix } from '@/app/utils/slug'
import { getEventByIdPrefix } from '@/app/utils/events'

export async function GET(req: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params

  const prefix = extractUuidPrefix(slug)
  let event
  try {
    event = prefix ? await getEventByIdPrefix(prefix) : null
  } catch {
    return NextResponse.json({ error: 'Error fetching event' }, { status: 500 })
  }

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

  return NextResponse.json(event)
}
