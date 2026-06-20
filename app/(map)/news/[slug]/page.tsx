import { notFound } from 'next/navigation'
import { extractUuidPrefix } from '@/app/utils/slug'
import { getUpdateByIdPrefix } from '@/app/utils/updates'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function NewsPage({ params }: Props) {
  const prefix = extractUuidPrefix((await params).slug)
  const update = prefix ? await getUpdateByIdPrefix(prefix) : null

  if (!update) notFound()

  return null
}
