import type { Metadata } from 'next'
import { getAllShopsForSeo, buildShopListJsonLd, jsonLdToString } from '@/app/utils/seo'

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

export default async function Home() {
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
