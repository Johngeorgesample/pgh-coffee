import { notFound } from 'next/navigation'
import { extractUuidPrefix } from '@/app/utils/slug'
import { getEventByIdPrefix } from '@/app/utils/events'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function EventPage({ params }: Props) {
  const prefix = extractUuidPrefix((await params).slug)
  const event = prefix ? await getEventByIdPrefix(prefix) : null

  if (!event) notFound()

  return null
}
