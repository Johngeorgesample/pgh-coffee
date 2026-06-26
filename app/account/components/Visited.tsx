'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPinCheck, MapPin } from 'lucide-react'
import ShopCard from '@/app/components/ShopCard'
import { formatDBShopAsFeature } from '@/app/utils/utils'
import type { DbShop } from '@/types/shop-types'
import VisitedProgress from './VisitedProgress'

interface Visit {
  id: string
  created_at: string
  shop: DbShop
}

export default function Visited() {
  const [visits, setVisits] = useState<Visit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const hasVisits = visits && visits.length > 0

  useEffect(() => {
    fetch('/api/visits')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch visits: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        setVisits(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch visits:', err)
        setError(true)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading...</div>

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <MapPinCheck className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Couldn&apos;t load your passport</h3>
          <p className="text-gray-500 max-w-sm">
            Something went wrong while loading your visited shops. Please try refreshing the page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <VisitedProgress />

      {hasVisits ? (
        <ul>
          {visits.map((visit) => (
            <ShopCard key={visit.id} shop={formatDBShopAsFeature(visit.shop)} />
          ))}
        </ul>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MapPinCheck className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No visits yet</h3>
            <p className="text-gray-500 max-w-sm">
              Mark the shops you&apos;ve been to and watch your passport fill up.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-lg py-3 px-4 text-sm font-semibold text-black bg-yellow-300 hover:bg-yellow-400"
            >
              <MapPin className="h-4 w-4" />
              Explore shops
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
