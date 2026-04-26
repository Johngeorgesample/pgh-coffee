import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const getRoaster = async (slug: string) => {
  const { data, error } = await supabase
    .from('roaster')
    .select('*, company:company_id(*), shops(name, neighborhood, photo, uuid)')
    .eq('slug', slug)
    .single()

  if (error) {
    logger.error('Error fetching roaster', { error: error.message })
    return null
  }

  return data
}

export async function GET(req: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  const { slug } = params

  const roasterData = await getRoaster(slug)

  if (!roasterData) {
    return NextResponse.json({ message: 'Roaster not found' }, { status: 404 })
  }

  return NextResponse.json(roasterData)
}
