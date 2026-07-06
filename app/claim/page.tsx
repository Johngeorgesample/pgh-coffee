import Link from 'next/link'
import { Footer } from '@/app/components/about'
import VerifiedBadge from '@/app/components/VerifiedBadge'
import ClaimForm from './ClaimForm'

interface TProps {
  searchParams: Promise<{ shop?: string; name?: string; neighborhood?: string; company?: string }>
}

export default async function ClaimAShop({ searchParams }: TProps) {
  const { shop, name, neighborhood, company } = await searchParams

  return (
    <div>
      <header className="max-w-7xl mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
            You built the spot. Make it official.
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 font-light leading-relaxed">
            Claim your shop to get a verified badge and a head start managing your own listing when self-serve editing
            launches.
          </p>
        </div>
      </header>

      {shop ? (
        <>
          {name && (
            <section className="max-w-2xl mx-auto px-6 pb-8">
              <p className="text-sm text-slate-500 text-center mb-3">Here&apos;s how your listing will look:</p>
              <div className="rounded-xl border border-stone-200 bg-white px-5 py-4 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-2xl font-serif font-normal tracking-tight">{name}</h2>
                  <VerifiedBadge className="mt-0.5" />
                </div>
                {neighborhood && <p className="text-base text-slate-500 mt-0.5">{neighborhood}</p>}
              </div>
            </section>
          )}
          <ClaimForm shopId={shop} shopName={name ?? 'this shop'} neighborhood={neighborhood} companyName={company} />
        </>
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
