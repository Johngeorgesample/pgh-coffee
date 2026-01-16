import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const fetchUpdate = async (id: string) => {
  const { data, error } = await supabase
    .from('updates')
    .select('*, shop:shops(*, company:company_id(*))')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching update:', error.message)
    return null
  }

  return data
}

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const { id } = params

  const update = await fetchUpdate(id)

  if (!update) {
    return NextResponse.json({ error: 'Update not found' }, { status: 404 })
  }

  return NextResponse.json(update)
}
