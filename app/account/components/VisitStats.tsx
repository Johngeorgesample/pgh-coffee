'use client'

import { useEffect, useState } from 'react'
import { Stamp, MapPin, Map } from 'lucide-react'
import type { DbShop } from '@/types/shop-types'

interface Visit {
  id: string
  created_at: string
  shop: DbShop
}

interface Stats {
  visited: number
  total: number
  topNeighborhood: string | null
  neighborhoodsVisited: number
  totalNeighborhoods: number
}

function computeStats(visits: Visit[], total: number, totalNeighborhoods: number): Stats {
  const counts: Record<string, number> = {}
  for (const visit of visits) {
    const neighborhood = visit.shop?.neighborhood
    if (neighborhood) {
      counts[neighborhood] = (counts[neighborhood] ?? 0) + 1
    }
  }

  let topNeighborhood: string | null = null
  let topCount = 0
  for (const [neighborhood, count] of Object.entries(counts)) {
    if (count > topCount) {
      topNeighborhood = neighborhood
      topCount = count
    }
  }

  return {
    visited: visits.length,
    total,
    topNeighborhood,
    neighborhoodsVisited: Object.keys(counts).length,
    totalNeighborhoods,
  }
}

export default function VisitStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/visits').then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch visits: ${res.status}`)
        return res.json()
      }),
      fetch('/api/shops/geojson').then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch shops: ${res.status}`)
        return res.json()
      }),
    ])
      .then(([visits, geojson]) => {
        const visitList: Visit[] = Array.isArray(visits) ? visits : []
        const features = geojson?.features ?? []
        const total = features.length
        const totalNeighborhoods = new Set(
          features
            .map((f: { properties?: { neighborhood?: string } }) => f.properties?.neighborhood)
            .filter(Boolean),
        ).size
        setStats(computeStats(visitList, total, totalNeighborhoods))
      })
      .catch((err) => {
        console.error('Failed to load visit stats:', err)
        setStats(null)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        icon={<Stamp className="h-5 w-5 text-yellow-600" />}
        label="Shops visited"
        value={`${stats.visited} of ${stats.total}`}
      />
      <StatCard
        icon={<Map className="h-5 w-5 text-yellow-600" />}
        label="Neighborhoods explored"
        value={`${stats.neighborhoodsVisited} of ${stats.totalNeighborhoods}`}
      />
      <StatCard
        icon={<MapPin className="h-5 w-5 text-yellow-600" />}
        label="Top neighborhood"
        value={stats.topNeighborhood ?? '—'}
      />
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-9 h-9 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 animate-pulse">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-9 h-9 bg-gray-200 rounded-full flex-shrink-0" />
        <div className="h-4 w-28 rounded bg-gray-200" />
      </div>
      <div className="h-8 w-20 rounded bg-gray-200" />
    </div>
  )
}
