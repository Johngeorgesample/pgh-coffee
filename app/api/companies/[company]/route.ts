import { NextRequest, NextResponse } from 'next/server'
import { publicCacheHeaders, SHOP_DATA_TTL } from '@/lib/cacheHeaders'
import { getCompanyWithShops } from '@/app/utils/companies'

export async function GET(req: NextRequest, props: { params: Promise<{ company: string }> }) {
  const { company: slug } = await props.params

  let company
  try {
    company = await getCompanyWithShops(slug)
  } catch {
    return NextResponse.json({ error: 'Error fetching company' }, { status: 500 })
  }

  if (!company) {
    return NextResponse.json({ message: 'Company not found' }, { status: 404 })
  }

  return NextResponse.json(company, { headers: publicCacheHeaders(SHOP_DATA_TTL) })
}
