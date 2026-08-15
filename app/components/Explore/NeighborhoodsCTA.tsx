'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { useAnalytics } from '@/hooks'
import useShopsStore from '@/stores/coffeeShopsStore'
import { areaPath, groupShopsIntoAreas, shopNoun } from '@/app/utils/neighborhoodAreas'

export const NeighborhoodsCTA = () => {
  const plausible = useAnalytics()
  const allShops = useShopsStore(s => s.allShops)
  const topAreas = groupShopsIntoAreas(allShops.features.map(f => f.properties)).slice(0, 4)

  if (topAreas.length === 0) return null

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="flex-1 text-xs font-semibold uppercase tracking-wider text-stone-500">Neighborhoods</h3>
        <Link
          href="/neighborhoods"
          className="flex gap-0.5 items-center text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: 'lab(45 10 50)' }}
          onClick={() => plausible('ViewAllClick', { props: { section: 'neighborhoods' } })}
        >
          View all
          <ChevronRight className="size-5" />
        </Link>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {topAreas.map(({ area, shops }) => {
          const cover = shops.find(shop => shop.photo)?.photo
          return (
            <Link
              key={area}
              href={areaPath(area)}
              className="group relative flex h-24 items-end overflow-hidden rounded-md shadow-sm"
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
              <div className="relative p-2.5 text-white">
                <p className="font-medium leading-tight">{area}</p>
                <p className="text-xs text-white/80">
                  {shops.length} {shopNoun(shops.length)}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
