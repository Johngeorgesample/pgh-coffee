import Link from 'next/link'
import { Footer } from '@/app/components/about'
import ClaimForm from './ClaimForm'

interface TProps {
  searchParams: Promise<{ shop?: string; name?: string }>
}

export default async function ClaimAShop({ searchParams }: TProps) {
  const { shop, name } = await searchParams

  return (
    <div>
      <header className="max-w-7xl mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">Claim your shop</h1>
          <p className="text-xl md:text-2xl text-slate-600 font-light leading-relaxed">
            Run one of these places? Take over the listing to keep its details accurate.
          </p>
        </div>
      </header>

      {shop ? (
        <ClaimForm shopId={shop} shopName={name ?? 'this shop'} />
      ) : (
        <section className="max-w-2xl mx-auto px-6 pb-20 text-center">
          <p className="text-lg text-slate-600">
            Find your shop on the{' '}
            <Link href="/" className="font-semibold text-yellow-600 underline">
              map
            </Link>{' '}
            and use the <span className="font-semibold">Claim this shop</span> button to get started.
          </p>
        </section>
      )}

      <Footer />
    </div>
  )
}
