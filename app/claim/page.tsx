import Link from 'next/link'
import { Footer } from '@/app/components/about'
import VerifiedBadge from '@/app/components/VerifiedBadge'
import { getShopByUuidPrefix } from '@/app/utils/shops'
import ClaimForm from './ClaimForm'

interface TProps {
  searchParams: Promise<{ shop?: string; name?: string; neighborhood?: string; company?: string }>
}

export default async function ClaimAShop({ searchParams }: TProps) {
  const { shop, name, neighborhood, company } = await searchParams

  // The first uuid group is the prefix the lookup expects. Fall back to the
  // params (name/neighborhood) if the shop can't be fetched.
  const shopRow = shop ? await getShopByUuidPrefix(shop.slice(0, 8)) : null
  const previewName = shopRow?.name ?? name
  const previewNeighborhood = shopRow?.neighborhood ?? neighborhood
  const previewPhoto = shopRow?.photo ?? undefined

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
          {previewName && (
            <section className="max-w-2xl mx-auto px-6 pb-8">
              <p className="text-sm text-slate-500 text-center mb-3">Here&apos;s how your listing will look:</p>
              <div className="rounded-xl overflow-hidden border border-stone-200 shadow-sm">
                <div
                  className="h-40 sm:h-48 relative bg-stone-300 bg-cover bg-center"
                  style={previewPhoto ? { backgroundImage: `url('${previewPhoto}')` } : undefined}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white">
                    <h2 className="flex items-center gap-1.5 text-2xl sm:text-3xl font-serif font-normal tracking-tight leading-tight">
                      {previewName}
                      <VerifiedBadge className="mt-0.5" />
                    </h2>
                    {previewNeighborhood && <p className="text-base text-white/80 mt-0.5">{previewNeighborhood}</p>}
                  </div>
                </div>
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
