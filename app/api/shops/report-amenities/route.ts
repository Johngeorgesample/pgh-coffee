import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: Request) {
  const { shop_id, amenities } = await request.json()

  if (!shop_id || !Array.isArray(amenities)) {
    return NextResponse.json({ error: 'Missing shop_id or amenities' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('amenity_reports')
    .insert([{ shop_id, amenities }])

  if (error) {
    console.error('Error submitting amenity report:', error.message)
    return NextResponse.json({ error: 'Error submitting amenity report' }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
