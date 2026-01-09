import type { Metadata } from 'next'
import HomeClient from './components/HomeClient'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ shop?: string }>
}): Promise<Metadata> {
  const params = await searchParams
  const shopParam = params.shop

  if (shopParam) {
    const ogUrl = `/api/og?shop=${encodeURIComponent(shopParam)}`
    return {
      openGraph: {
        images: [ogUrl],
      },
      twitter: {
        images: [ogUrl],
      },
    }
  }

  return {}
}

export default function Home() {
  return <HomeClient />
}
