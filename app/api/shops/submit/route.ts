import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: Request) {
  const { name, address, neighborhood, website } = await request.json()

  if (!name || !address) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('moderation')
    .insert([{ name, address, neighborhood, website }])

  if (error) {
    console.error('Error adding shop:', error.message)
    return NextResponse.json({ error: 'Error adding shop' }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
