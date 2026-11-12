import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCompanyForSeo, getCompanyShops, getCompanyRoaster } from '@/app/utils/companies'
import PanelSeed from '@/app/components/PanelSeed'
import { buildEntryMetadata } from '@/app/utils/seo'

type Props = {
  params: Promise<{ slug: string }>
}

export const revalidate = 300

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const company = await getCompanyForSeo((await params).slug)
  if (!company) return {}

  return buildEntryMetadata({ name: company.name, description: company.description?.trim() || undefined, path: `/companies/${company.slug}` })
}

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params
  const company = await getCompanyForSeo(slug)
  if (!company) notFound()

  const [shops, roaster] = await Promise.all([getCompanyShops(company.id), getCompanyRoaster(company.id)])
  return shops && <PanelSeed seedKey={`company:${slug}`} data={{ ...company, shops, roaster }} />
}
