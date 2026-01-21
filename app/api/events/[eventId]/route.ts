import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Cache for 1 hour, revalidate in background
export const revalidate = 3600

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const getEvent = async (eventId: string) => {
  const { data, error } = await supabase
    .from('events')
    .select('*, shop:shop_id(*, company:company_id(*)), roaster:roaster_id(*)')
    .eq('id', eventId)
    .single()

  if (error) {
    console.error('Error fetching event:', error.message)
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

  return NextResponse.json(event, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=60',
    },
  })
}
