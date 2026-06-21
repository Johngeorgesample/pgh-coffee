import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getUpdateForSeo, buildNewsMetadata, buildNewsJsonLd, jsonLdToString } from '@/app/utils/seo'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const update = await getUpdateForSeo((await params).slug)
  return update ? buildNewsMetadata(update) : {}
}

export default async function NewsPage({ params }: Props) {
  const update = await getUpdateForSeo((await params).slug)

  if (!update) notFound()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdToString(buildNewsJsonLd(update)) }} />
      {/* NewsDetails renders its own <h1> after client-side fetch; this keeps a
          server-rendered heading for crawlers. */}
      <h1 className="sr-only">{update.title}</h1>
    </>
  )
}
