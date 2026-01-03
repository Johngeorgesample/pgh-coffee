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

  if (error) {
    console.error('Error fetching company:', error.message)
    return null
  }

  return data
}

const getCompanyNews = async (companyId: string) => {
  const { data, error } = await supabase
    .from('updates')
    .select('*, shop:shops!inner(*, company:company_id(*))')
    .eq('shops.company_id', companyId)

  if (error) {
    console.error('Error fetching company news:', error.message)
    return null
  }

  return data
}

export async function GET(req: NextRequest, props: { params: Promise<{ company: string }> }) {
  const params = await props.params
  const { company } = params

  const companyData = await getCompany(company)

  if (!companyData) {
    return NextResponse.json({ message: 'Company not found' }, { status: 404 })
  }

  const news = await getCompanyNews(companyData.id)

  if (news === null) {
    return NextResponse.json({ error: 'Error fetching company news' }, { status: 500 })
  }

  return NextResponse.json(news)
}
