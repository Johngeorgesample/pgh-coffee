import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getRoasterForSeo } from '@/app/utils/roasters'
import { buildEntryMetadata } from '@/app/utils/seo'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const roaster = await getRoasterForSeo((await params).slug)
  if (!roaster) return {}

  return buildEntryMetadata({ name: roaster.name, description: roaster.description?.trim() || undefined, path: `/roasters/${roaster.slug}` })
}

export default async function RoasterPage({ params }: Props) {
  if (!(await getRoasterForSeo((await params).slug))) notFound()

  return null
}
