import type { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'
import { getEventByIdPrefix } from '@/app/utils/events'
import { getUpdateByIdPrefix } from '@/app/utils/updates'
import { buildContentSlug } from '@/app/utils/slug'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'PGH Coffee',
    description: 'Explore independent coffee shops across Pittsburgh\'s neighborhoods — find your next favorite spot on the map.',
    openGraph: {
      title: 'PGH Coffee',
      description: 'Explore independent coffee shops across Pittsburgh\'s neighborhoods — find your next favorite spot on the map.',
    },
  }
}

export default async function Home({ searchParams }: Props) {
  const params = await searchParams

  // Redirect legacy detail links (?event=, ?news=) to their real paths.
  // The list params (?events, ?news with no value) fall through to the map.
  // Legacy ?shop= links are intentionally no longer redirected (the base branch
  // dropped that path); they just land on the bare map.
  const eventParam = params.event
  if (typeof eventParam === 'string' && eventParam) {
    const event = await getEventByIdPrefix(eventParam)
    if (event) permanentRedirect(`/events/${buildContentSlug(event)}`)
  }

  const newsParam = params.news
  if (typeof newsParam === 'string' && newsParam) {
    const update = await getUpdateByIdPrefix(newsParam)
    if (update) permanentRedirect(`/news/${buildContentSlug(update)}`)
  }

  return null
}
