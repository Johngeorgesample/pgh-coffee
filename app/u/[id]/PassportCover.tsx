'use client'

import { useEffect, useMemo } from 'react'
import { User } from 'lucide-react'
import useShopsStore from '@/stores/coffeeShopsStore'
import type { TFeatureCollection } from '@/types/shop-types'
import { computeStats, type Visit } from '@/app/utils/visitStats'
import PassportMinimap from './PassportMinimap'

function statsFor(visits: Visit[], allShops: TFeatureCollection) {
  const neighborhoods = new Set(allShops.features.map((f) => f.properties.neighborhood).filter(Boolean))
  return computeStats(visits, allShops.features.length, neighborhoods.size)
}

export default function PassportCover({
  name,
  avatarUrl,
  visits,
}: {
  name: string
  avatarUrl: string | null
  visits: Visit[]
}) {
  const allShops = useShopsStore((s) => s.allShops)
  const fetchCoffeeShops = useShopsStore((s) => s.fetchCoffeeShops)
  const stats = useMemo(() => statsFor(visits, allShops), [visits, allShops])

  useEffect(() => {
    fetchCoffeeShops()
  }, [fetchCoffeeShops])

  return (
    <div className="relative h-[360px] sm:h-[440px] bg-neutral-900">
      <PassportMinimap
        visits={visits}
        allShops={allShops}
        className="absolute inset-0"
        padding={{ top: 40, bottom: 160, left: 40, right: 40 }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-6 flex flex-col sm:flex-row sm:items-end gap-4 text-white">
          <Avatar name={name} url={avatarUrl} />
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{name}</h1>
            {stats.topNeighborhood && (
              <p className="text-white/70">
                Top neighborhood: <span className="text-yellow-300 font-semibold">{stats.topNeighborhood}</span>
              </p>
            )}
          </div>
          <div className="flex gap-6">
            <BigNumber value={stats.visited} of={stats.total} label="shops" />
            <BigNumber value={stats.neighborhoodsVisited} of={stats.totalNeighborhoods} label="neighborhoods" />
          </div>
        </div>
      </div>
    </div>
  )
}

function Avatar({ name, url }: { name: string; url: string | null }) {
  return (
    <div className="w-20 h-20 ring-4 ring-yellow-300 bg-yellow-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
      {url ? <img className="w-full h-full object-cover" src={url} alt={name} /> : <User className="w-10 h-10 text-yellow-600" />}
    </div>
  )
}

function BigNumber({ value, of, label }: { value: number; of: number; label: string }) {
  return (
    <div>
      <p className="text-3xl font-bold tabular-nums">
        {value}
        {of > 0 && <span className="text-base font-medium text-white/50">/{of}</span>}
      </p>
      <p className="text-xs uppercase tracking-wide text-white/60">{label}</p>
    </div>
  )
}
