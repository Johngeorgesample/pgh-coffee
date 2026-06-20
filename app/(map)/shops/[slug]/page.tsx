import { notFound } from 'next/navigation'
import { extractUuidPrefix } from '@/app/utils/shopSlug'
import { getShopByUuidPrefix } from '@/app/utils/shops'
import { formatDBShopAsFeature } from '@/app/utils/utils'
import ShopSeed from './ShopSeed'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function ShopPage({ params }: Props) {
  const { slug } = await params

  const prefix = extractUuidPrefix(slug)
  const shop = prefix ? await getShopByUuidPrefix(prefix) : null

  if (!shop) notFound()

  return <ShopSeed shop={formatDBShopAsFeature(shop)} />
}
