import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getShopForSeo, buildShopMetadata, buildShopJsonLd, jsonLdToString } from '@/app/utils/seo'
import { formatDBShopAsFeature } from '@/app/utils/utils'
import ShopSeed from './ShopSeed'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const shop = await getShopForSeo((await params).slug)
  return shop ? buildShopMetadata(shop) : {}
}

export default async function ShopPage({ params }: Props) {
  // getShopForSeo is cache()-wrapped, so this shares the query generateMetadata
  // already ran for this request.
  const shop = await getShopForSeo((await params).slug)

  if (!shop) notFound()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdToString(buildShopJsonLd(shop)) }} />
      {/* PanelHeader renders its own <h1> with the shop name, but only after
          client-side data fetching completes, so the server-rendered HTML
          has none. */}
      <h1 className="sr-only">{shop.name}</h1>
      {/* Seed the client store with the shop the server already fetched so
          useShopRouteSync short-circuits instead of re-fetching over the API. */}
      <ShopSeed shop={formatDBShopAsFeature(shop)} />
    </>
  )
}
