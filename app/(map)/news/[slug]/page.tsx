import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getUpdateForSeo } from '@/app/utils/updates'
import { buildContentSlug } from '@/app/utils/slug'
import { SITE_NAME } from '@/app/utils/seo'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const update = await getUpdateForSeo((await params).slug)
  if (!update) return {}

  const title = `${update.title} | ${SITE_NAME}`
  const description = update.description?.trim() || (update.shop ? `News from ${update.shop.name}` : undefined)
  const path = `/news/${buildContentSlug(update)}`

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { siteName: SITE_NAME, title, description, type: 'article', url: path },
  }
}

export default async function NewsPage({ params }: Props) {
  if (!(await getUpdateForSeo((await params).slug))) notFound()

  return null
}
