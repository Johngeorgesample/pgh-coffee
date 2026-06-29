import type { Metadata } from 'next'
import { Hero, SubmitForm, QuoteSection } from '@/app/components/submit'
import { Footer } from '@/app/components/about'

const description = "Know an independent Pittsburgh coffee shop that's missing from pgh.coffee? Submit it to be added to the map."

export const metadata: Metadata = {
  title: 'Submit a Shop | pgh.coffee',
  description,
  alternates: { canonical: '/submit-a-shop' },
  openGraph: {
    title: 'Submit a Shop | pgh.coffee',
    description,
    url: '/submit-a-shop',
  },
}

export default function SubmitAShop() {
  return (
    <div>
      <Hero />
      <SubmitForm />
      <QuoteSection />
      <Footer />
    </div>
  )
}
