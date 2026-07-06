import VerifiedBadge from '@/app/components/VerifiedBadge'
import { getShopByUuidPrefix } from '@/app/utils/shops'

interface IProps {
  shopId: string
  name?: string
  neighborhood?: string
}

export default async function ClaimShopPreview({ shopId, name, neighborhood }: IProps) {
  // The first uuid group is the prefix the lookup expects. Fall back to the
  // params (name/neighborhood) if the shop can't be fetched.
  const shopRow = await getShopByUuidPrefix(shopId.slice(0, 8))
  const previewName = shopRow?.name ?? name
  const previewNeighborhood = shopRow?.neighborhood ?? neighborhood
  const previewPhoto = shopRow?.photo ?? undefined

  if (!previewName) return null

  return (
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
  )
}
