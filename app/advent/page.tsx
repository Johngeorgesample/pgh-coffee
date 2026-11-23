import type { Metadata } from 'next'
import { Footer } from '@/app/components/about'
import AdventHero from '@/app/components/advent/AdventHero'
import AdventRoute from '@/app/components/advent/AdventRoute'

const description = `Twenty-five days of Pittsburgh coffee: one jar a day from Pittsburgh roasters, December 1st through Christmas, picked by Dynamic Coffee Roasters and Origin Coffee Club. Come back each day to read where the coffee came from and how to brew it.`

export const metadata: Metadata = {
  title: 'Pittsburgh coffee advent calendar | pgh.coffee',
  description,
  alternates: { canonical: '/advent' },
  openGraph: {
    title: 'Pittsburgh coffee advent calendar | pgh.coffee',
    description,
    type: 'website',
    url: '/advent',
  },
}

export default function AdventCalendar() {
  return (
    <div>
      <AdventHero />

      <AdventRoute />

      <Footer />
    </div>
  )
}
