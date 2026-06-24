import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'
import { publicCacheHeaders, SHOP_DATA_TTL } from '@/lib/cacheHeaders'
import { getCompanyBySlug } from '@/app/utils/companies'

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const getCompanyShops = async (companyId: string) => {
  const { data, error } = await supabase
    .from('shops')
    .select('*, company:company_id(*)')
    .eq('company_id', companyId)

  if (error) {
    logger.error('Error fetching company shops', { error: error.message })
    return null
  }

  return data
}

const getCompanyRoaster = async (companyId: string) => {
  const { data, error } = await supabase
    .from('roaster')
    .select('name, slug')
    .eq('company_id', companyId)
    .maybeSingle()

  if (error) {
    logger.error('Error fetching company roaster', { error: error.message })
    return null
  }

  return data
}

export async function GET(req: NextRequest, props: { params: Promise<{ company: string }> }) {
  const params = await props.params
  const { company } = params

  const companyData = await getCompanyBySlug(company)

  if (!companyData) {
    return NextResponse.json({ message: 'Company not found' }, { status: 404 })
  }

  const shops = await getCompanyShops(companyData.id)

  if (shops === null) {
    return NextResponse.json({ error: 'Error fetching company shops' }, { status: 500 })
  }

  const roaster = await getCompanyRoaster(companyData.id)

  return NextResponse.json({
    ...companyData,
    shops,
    roaster
  }, { headers: publicCacheHeaders(SHOP_DATA_TTL) })
}
