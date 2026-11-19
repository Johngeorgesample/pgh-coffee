import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { getCompanyBySlug } from '@/app/utils/companies'
import { visibleEvents, withInheritedVerification, type EventRow } from '@/app/utils/events'
import { withMetrics } from '@/lib/withMetrics'

const getCompanyEvents = async (companyId: string) => {
  const { data, error } = await visibleEvents('*, shop:shops!inner(*, company:company_id(is_verified))')
    .eq('shops.company_id', companyId)

  if (error) {
    logger.error('Error fetching company events', { error: error.message })
    return null
  }

  return (data as EventRow[]).map(withInheritedVerification)
}

async function handleGET(req: NextRequest, props: { params: Promise<{ company: string }> }) {
  const params = await props.params
  const { company } = params

  const companyData = await getCompanyBySlug(company)

  if (!companyData) {
    return NextResponse.json({ message: 'Company not found' }, { status: 404 })
  }

  const events = await getCompanyEvents(companyData.id)

  if (events === null) {
    return NextResponse.json({ error: 'Error fetching company events' }, { status: 500 })
  }

  return NextResponse.json(events)
}

export const GET = withMetrics('companies/[company]/events', handleGET)
