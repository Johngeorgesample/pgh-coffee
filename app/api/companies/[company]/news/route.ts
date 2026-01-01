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

const getCompanyNews = async (companyId: string) => {
  const { data, error } = await supabase
    .from('updates')
    .select('*, shop:shops!inner(*, company:company_id(*))')
    .eq('shops.company_id', companyId)
  return data
}

export async function GET(req: NextRequest, props: { params: Promise<{ company: string }> }) {
  const params = await props.params
  const { company } = params

  const newsData = await getCompany(company)

  if (!newsData) {
    return NextResponse.json({ message: 'Company not found' }, { status: 404 })
  }

  const news = await getCompanyNews(newsData.id)

  return NextResponse.json(news)
}
