import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: Request) {
  const body = await request.json()
  const { shop_id, reported_name, reported_address, reported_neighborhood, reported_website } = body

  if (!shop_id) {
    return NextResponse.json({ error: 'Missing shop_id' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('shop_reports')
    .insert([{
      shop_id,
      reported_name,
      reported_address,
      reported_neighborhood,
      reported_website,
    }])

  if (error) {
    console.error('Error submitting report:', error.message)
    return NextResponse.json({ error: 'Error submitting report' }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
