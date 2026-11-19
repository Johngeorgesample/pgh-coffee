'use client'

import { useMemo } from 'react'
import useShopsStore from '@/stores/coffeeShopsStore'
import NearbyShopList from '@/app/components/NearbyShopList'
import { nearestShops } from '@/app/utils/shopsByDistance'
import { useDistanceUnits } from '@/hooks/useDistanceUnits'
import { metersToUnits } from '@/types/unit-types'

interface IProps {
  query: string
  label: string
  point: [number, number] | null
}

export default function NearShops({ label, point }: IProps) {
  const allShops = useShopsStore(s => s.allShops)
  const units = useDistanceUnits()

  const nearest = useMemo(
    () => (point ? nearestShops(allShops.features ?? [], point) : []),
    [allShops, point],
  )

  return (
    <div className="flex h-full flex-col overflow-y-auto px-4 sm:px-6">
      <div className="mt-20">
        {point ? (
          <>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Shops near {label}</h2>
            <NearbyShopList
              shops={nearest.map(n => n.shop)}
              distances={nearest.map(n => metersToUnits(n.meters, units))}
              units={units}
            />
          </>
        ) : (
          <p className="mt-6 text-center text-gray-700">{label}</p>
        )}
      </div>
    </div>
  )
}
