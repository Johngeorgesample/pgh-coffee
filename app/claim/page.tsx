import Link from 'next/link'
import { Footer } from '@/app/components/about'
import { getShopByUuidPrefix } from '@/app/utils/shops'
import ClaimShopPreview from './ClaimShopPreview'
import ClaimForm from './ClaimForm'

interface TProps {
  searchParams: Promise<{ shop?: string }>
}

export default async function ClaimAShop({ searchParams }: TProps) {
  const { shop } = await searchParams

  // The first uuid group is the prefix the lookup expects. Everything the page
  // shows (name, neighborhood, photo, company) comes from this row, so the claim
  // link only needs the uuid.
  const shopRow = shop ? await getShopByUuidPrefix(shop.slice(0, 8)) : null

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

      {shopRow ? (
        <>
          <ClaimShopPreview name={shopRow.name} neighborhood={shopRow.neighborhood} photo={shopRow.photo ?? undefined} />
          <ClaimForm
            shopId={shopRow.uuid}
            shopName={shopRow.name}
            neighborhood={shopRow.neighborhood}
            companyName={shopRow.company?.name}
          />
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
