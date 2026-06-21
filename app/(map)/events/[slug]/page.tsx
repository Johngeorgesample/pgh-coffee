import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getEventForSeo, buildEventMetadata, buildEventJsonLd, jsonLdToString } from '@/app/utils/seo'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEventForSeo((await params).slug)
  return event ? buildEventMetadata(event) : {}
}

export default async function EventPage({ params }: Props) {
  const event = await getEventForSeo((await params).slug)

  if (!event) notFound()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdToString(buildEventJsonLd(event)) }} />
      {/* EventDetails renders its own <h1> after client-side fetch; this keeps a
          server-rendered heading for crawlers. */}
      <h1 className="sr-only">{event.title}</h1>
    </>
  )
}
