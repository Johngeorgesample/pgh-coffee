import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Cache for 1 hour, revalidate in background
export const revalidate = 3600

// Supabase configuration
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

const getCompanyShops = async (companyId: string) => {
  const { data, error } = await supabase
    .from('shops')
    .select('*, company:company_id(*)')
    .eq('company_id', companyId)

  if (error) {
    console.error('Error fetching company shops:', error.message)
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

  const shops = await getCompanyShops(companyData.id)

  if (shops === null) {
    return NextResponse.json({ error: 'Error fetching company shops' }, { status: 500 })
  }

  return NextResponse.json({
    ...companyData,
    shops
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=60',
    },
  })
}
