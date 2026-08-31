import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  getAreaBySlug,
  getNeighborhoodAreas,
  buildAreaMetadata,
  buildAreaJsonLd,
  buildShopPath,
  jsonLdToString,
} from '@/app/utils/seo'
import { areaPath, nearestAreas, shopNoun } from '@/app/utils/neighborhoodAreas'
import VerifiedBadge from '@/app/components/VerifiedBadge'
import { Footer } from '@/app/components/about'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const area = await getAreaBySlug((await params).slug)
  return area ? buildAreaMetadata(area) : {}
}

export default async function NeighborhoodPage({ params }: Props) {
  const area = await getAreaBySlug((await params).slug)
  if (!area) notFound()

  const nearby = nearestAreas(area, await getNeighborhoodAreas(), 5)

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdToString(buildAreaJsonLd(area)) }} />
      <h1 className="text-3xl font-serif tracking-tight">Coffee shops in {area.area}</h1>
      <p className="mt-2 text-stone-600">
        {area.shops.length} independent coffee {shopNoun(area.shops.length)} in {area.area}, Pittsburgh.
      </p>
      <ul className="mt-8 divide-y divide-stone-200">
        {area.shops.map(shop => (
          <li key={shop.uuid} className="py-4">
            <Link href={buildShopPath(shop)} className="flex gap-4">
              {shop.photo && (
                <img
                  src={shop.photo}
                  alt=""
                  loading="lazy"
                  className="h-20 w-20 shrink-0 rounded-md object-cover object-center"
                />
              )}
              <div>
                <span className="inline-flex items-center gap-1 text-lg font-medium underline underline-offset-2">
                  {shop.name}
                  {shop.verified && <VerifiedBadge />}
                </span>
                <p className="text-sm text-stone-600">{shop.address}</p>
                {shop.description && <p className="mt-1 text-sm text-stone-500">{shop.description}</p>}
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* Plain <a> forces a full load so useURLNeighborhoodSync's mount effect
          runs — a soft Link navigation fires neither mount nor popstate, so the
          neighborhood filter would never apply. */}
      <a
        href={`/?neighborhood=${encodeURIComponent(area.area)}`}
        className="mt-10 inline-flex items-center gap-2 rounded-full bg-yellow-300 px-5 py-2.5 font-medium text-stone-900 transition hover:bg-yellow-400"
      >
        See {area.area} on the map
        <span aria-hidden>→</span>
      </a>

      {nearby.length > 0 && (
        <div className="mt-10">
          <p className="text-sm font-medium text-stone-500">Nearby neighborhoods</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {nearby.map(({ area: name, shops }) => (
              <Link
                key={name}
                href={areaPath(name)}
                className="rounded-full border border-stone-200 px-3 py-1.5 text-sm transition hover:border-stone-300 hover:bg-stone-50"
              >
                {name} <span className="text-stone-400">{shops.length}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <p className="mt-10 text-sm">
        <Link href="/neighborhoods" className="text-stone-500 underline underline-offset-2 hover:text-stone-700">
          All neighborhoods
        </Link>
      </p>
    </div>
    <Footer />
    </div>
  )
}
