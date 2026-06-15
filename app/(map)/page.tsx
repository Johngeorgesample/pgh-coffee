import type { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'
import { getShopByNameAndNeighborhood } from '@/app/utils/shops'
import { buildShopSlug } from '@/app/utils/shopSlug'

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
  const shopParam = (await searchParams).shop

  if (typeof shopParam === 'string') {
    const [name, neighborhood] = shopParam.split('_')
    const shop = name && neighborhood ? await getShopByNameAndNeighborhood(name, neighborhood) : null
    if (shop) permanentRedirect(`/shops/${buildShopSlug(shop)}`)
  }

  return null
}
