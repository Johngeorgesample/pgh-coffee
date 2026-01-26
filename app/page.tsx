import type { Metadata } from 'next'
import HomeClient from './components/HomeClient'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams
  const shopParam = params.shop

  if (!shopParam || typeof shopParam !== 'string') {
    return {
      title: 'PGH Coffee',
      description: 'Coffee shops in Pittsburgh, PA',
    }
  }

  const [name, neighborhood] = shopParam.split('_')

  if (!name || !neighborhood) {
    return {
      title: 'PGH Coffee',
      description: 'Coffee shops in Pittsburgh, PA',
    }
  }

  return {
    title: `${name} | ${neighborhood} | pgh.coffee`,
    description: `${name} - a coffee shop in ${neighborhood}, Pittsburgh, PA`,
  }
}

export default function Home() {
  return <HomeClient />
}
