import { notFound } from 'next/navigation'
import { getCompanyBySlug } from '@/app/utils/companies'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params
  const company = await getCompanyBySlug(slug)

  if (!company) notFound()

  return null
}
