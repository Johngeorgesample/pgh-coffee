import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const fetchShops = async (neighborhood?: string) => {
  let query = supabase.from('ShopsV4').select('*')

  if (neighborhood) {
    query = query.eq('neighborhood', neighborhood)
  }

  const { data, error } = await query
  if (error) {
    console.error('Error fetching shops:', error.message)
    return null
  }
  return data
}

// API Route Handler
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const neighborhood = searchParams.get('neighborhood') ?? ''

  const shops = await fetchShops(neighborhood)

  if (!shops) {
    return NextResponse.json({ error: 'Error fetching shops' }, { status: 500 })
  }

  return NextResponse.json(shops)
}
