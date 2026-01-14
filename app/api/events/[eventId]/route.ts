import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

  return NextResponse.json(event)
}
