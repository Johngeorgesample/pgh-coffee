import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const getCompany = async (slug: string) => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', slug)
    .single()
  return data
}

const getCompanyEvents = async (companyId: string) => {
  const { data, error } = await supabase
    .from('events')
    .select('*, shop:shops!inner(*, company:company_id(*))')
    .eq('shops.company_id', companyId)
  return data
}

export async function GET(req: NextRequest, props: { params: Promise<{ company: string }> }) {
  const params = await props.params
  const { company } = params

  const eventsData = await getCompany(company)

  if (!eventsData) {
    return NextResponse.json({ message: 'Company not found' }, { status: 404 })
  }

  const events = await getCompanyEvents(eventsData.id)

  return NextResponse.json(events)
}
