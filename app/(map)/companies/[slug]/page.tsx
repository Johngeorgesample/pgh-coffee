import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCompanyForSeo } from '@/app/utils/companies'
import { buildEntryMetadata } from '@/app/utils/seo'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const company = await getCompanyForSeo((await params).slug)
  if (!company) return {}

  return buildEntryMetadata({ name: company.name, description: company.description?.trim() || undefined, path: `/companies/${company.slug}` })
}

export default async function CompanyPage({ params }: Props) {
  if (!(await getCompanyForSeo((await params).slug))) notFound()

  return null
}
