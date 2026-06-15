import type { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'
import { getShopByNameAndNeighborhood } from '@/app/utils/shops'
import { buildShopSlug } from '@/app/utils/shopSlug'
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
  const shopParam = (await searchParams).shop

  if (typeof shopParam === 'string') {
    const [name, neighborhood] = shopParam.split('_')
    const shop = name && neighborhood ? await getShopByNameAndNeighborhood(name, neighborhood) : null
    if (shop) permanentRedirect(`/shops/${buildShopSlug(shop)}`)
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
