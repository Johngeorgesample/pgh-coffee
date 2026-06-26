'use client'

import { useEffect, useState } from 'react'
import { MapPinCheck } from 'lucide-react'
import type { VisitsProgress } from '@/app/api/visits/progress/route'

export default function VisitedProgress() {
  const [progress, setProgress] = useState<VisitsProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/visits/progress')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch progress: ${res.status}`)
        return res.json()
      })
      .then((data: VisitsProgress) => {
        setProgress(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch visit progress:', err)
        setError(true)
        setLoading(false)
      })
  }, [])

  if (loading || error || !progress) return null

  const { total, visited, byNeighborhood } = progress
  const neighborhoodsVisited = byNeighborhood.filter((n) => n.visited > 0).length
  const neighborhoodsTotal = byNeighborhood.length
  const visitedNeighborhoods = byNeighborhood
    .filter((n) => n.visited > 0)
    .sort((a, b) => b.visited - a.visited)

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <MapPinCheck className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <p className="text-2xl font-semibold text-gray-900">
            {visited} of {total} shops
          </p>
          <p className="text-sm text-gray-500">
            {neighborhoodsVisited} of {neighborhoodsTotal} neighborhoods
          </p>
        </div>
      </div>

      {visitedNeighborhoods.length > 0 && (
        <ul className="border-t border-gray-200 pt-4 space-y-2">
          {visitedNeighborhoods.map((n) => (
            <li key={n.neighborhood} className="flex items-center gap-3 text-sm">
              <span className="w-40 flex-shrink-0 text-gray-700 truncate">{n.neighborhood}</span>
              <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-green-500"
                  style={{ width: `${Math.round((n.visited / n.total) * 100)}%` }}
                />
              </div>
              <span className="w-12 flex-shrink-0 text-right tabular-nums text-gray-500">
                {n.visited}/{n.total}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
