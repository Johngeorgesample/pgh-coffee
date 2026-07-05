'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ShopCard from '@/app/components/ShopCard'
import { formatDBShopAsFeature } from '@/app/utils/utils'
import type { DbShop } from '@/types/shop-types'

interface Entry {
  id: string
  shop: DbShop
}

const PREVIEW_COUNT = 3

export default function ShopListPreview({
  title,
  endpoint,
  viewAllHref,
  emptyText,
}: {
  title: string
  endpoint: string
  viewAllHref: string
  emptyText: string
}) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch ${endpoint}: ${res.status}`)
        return res.json()
      })
      .then((data) => setEntries(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error(`Failed to fetch ${endpoint}:`, err)
        setError(true)
      })
      .finally(() => setLoading(false))
  }, [endpoint])

  if (error) return null

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 animate-pulse">
        <div className="h-6 w-32 rounded bg-gray-200 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: PREVIEW_COUNT }).map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-gray-100" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {entries.length > PREVIEW_COUNT && (
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1 text-sm font-medium text-yellow-600 hover:text-yellow-700"
          >
            See all
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      {entries.length > 0 ? (
        <ul>
          {entries.slice(0, PREVIEW_COUNT).map((entry) => (
            <ShopCard key={entry.id} shop={formatDBShopAsFeature(entry.shop)} />
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">{emptyText}</p>
      )}
    </div>
  )
}
