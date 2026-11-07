import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getUpdateForSeo } from '@/app/utils/updates'
import { buildContentSlug } from '@/app/utils/slug'
import { buildEntryMetadata } from '@/app/utils/seo'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const update = await getUpdateForSeo((await params).slug)
  if (!update) return {}

  return buildEntryMetadata({
    name: update.title,
    description: update.description?.trim() || (update.shop ? `News from ${update.shop.name}` : undefined),
    path: `/news/${buildContentSlug(update)}`,
  })
}

export default async function NewsPage({ params }: Props) {
  if (!(await getUpdateForSeo((await params).slug))) notFound()

  return null
}
