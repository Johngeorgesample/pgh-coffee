import { NextRequest, NextResponse } from 'next/server'
import { publicCacheHeaders, SHOP_DATA_TTL } from '@/lib/cacheHeaders'
import { getCompanyBySlug, getCompanyShops, getCompanyRoaster } from '@/app/utils/companies'

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
