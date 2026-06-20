import type { Metadata } from 'next'

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

export default async function Home() {
  return null
}
