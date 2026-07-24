import type { Metadata } from 'next'
import Link from 'next/link'
import { getNeighborhoodAreas } from '@/app/utils/seo'
import { areaPath } from '@/app/utils/neighborhoodAreas'
import { Footer } from '@/app/components/about'

export const metadata: Metadata = {
  title: 'Coffee shops by neighborhood | pgh.coffee',
  description: 'Independent Pittsburgh coffee shops, organized by neighborhood.',
  alternates: { canonical: '/neighborhoods' },
}

export default async function NeighborhoodsPage() {
  const areas = await getNeighborhoodAreas()

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      <h1 className="text-3xl font-serif tracking-tight">Coffee shops by neighborhood</h1>
      <p className="mt-2 max-w-2xl text-stone-600">
        Browse Pittsburgh&rsquo;s independent coffee shops by where they are — {areas.length} neighborhoods, from
        Lawrenceville to the South Hills.
      </p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map(({ area, shops }) => {
          const cover = shops.find(shop => shop.photo)?.photo
          return (
            <li key={area}>
              <Link
                href={areaPath(area)}
                className="group relative flex h-28 items-end overflow-hidden rounded-lg shadow-sm"
              >
                {cover ? (
                  <img
                    src={cover}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-center transition group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-yellow-200" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                <div className="relative p-3 text-white">
                  <p className="text-lg font-medium leading-tight">{area}</p>
                  <p className="text-xs text-white/80">{shops.length} shops</p>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
    <Footer />
    </div>
  )
}
