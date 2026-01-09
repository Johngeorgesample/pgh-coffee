import type { Metadata } from 'next'
import { headers } from 'next/headers'
import HomeClient from './components/HomeClient'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ shop?: string }>
}): Promise<Metadata> {
  const params = await searchParams
  const shopParam = params.shop

  if (shopParam) {
    const headersList = await headers()
    const host = headersList.get('host') || 'pgh.coffee'
    const protocol = headersList.get('x-forwarded-proto') || 'https'
    const baseUrl = `${protocol}://${host}`

    const ogUrl = `${baseUrl}/api/og?shop=${encodeURIComponent(shopParam)}`
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
