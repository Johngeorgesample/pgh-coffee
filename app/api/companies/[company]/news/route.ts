import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { getCompanyBySlug } from '@/app/utils/companies'
import { getClient } from '@/lib/supabase/server-client'

const getCompanyNews = async (companyId: string) => {
  const { data, error } = await getClient()
    .from('updates')
    .select('*, shop:shops!inner(*, company:company_id(*))')
    .eq('shops.company_id', companyId)

  if (error) {
    logger.error('Error fetching company news', { error: error.message })
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

  const news = await getCompanyNews(companyData.id)

  if (news === null) {
    return NextResponse.json({ error: 'Error fetching company news' }, { status: 500 })
  }

  return NextResponse.json(news)
}
