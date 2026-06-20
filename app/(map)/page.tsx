import type { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'
import { getEventByIdPrefix } from '@/app/utils/events'
import { getUpdateByIdPrefix } from '@/app/utils/updates'
import { buildContentSlug } from '@/app/utils/slug'
import { getAllShopsForSeo, buildShopListJsonLd, jsonLdToString } from '@/app/utils/seo'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const description =
  "Explore independent coffee shops across Pittsburgh's neighborhoods — find your next favorite spot on the map."

export const metadata: Metadata = {
  title: 'PGH Coffee',
  description,
  alternates: { canonical: '/' },
  openGraph: {
    title: 'PGH Coffee',
    description,
    url: '/',
  },
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

  const jsonLd = buildShopListJsonLd(await getAllShopsForSeo())

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdToString(jsonLd) }} />
      {/* PanelHeader renders an <h1> with the shop name when a shop is selected,
          so this page-level h1 is only needed for the bare map view. */}
      <h1 className="sr-only">Pittsburgh coffee shop map | pgh.coffee</h1>
    </>
  )
}
