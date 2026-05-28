import { Hero, SubmitForm, QuoteSection } from '@/app/components/submit'
import { Footer } from '@/app/components/about'

export const metadata = {
  title: 'Submit a Shop | Pittsburgh Coffee',
  description: 'Submit a new coffee shop to be considered for pgh.coffee.',
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
