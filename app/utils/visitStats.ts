import type { DbShop } from '@/types/shop-types'

export interface Visit {
  id: string
  created_at: string
  shop: DbShop
}

export interface Stats {
  visited: number
  total: number
  topNeighborhood: string | null
  neighborhoodsVisited: number
  totalNeighborhoods: number
}

export const openVisits = (visits: Visit[]) =>
  visits.filter((visit) => !visit.shop?.permanently_closed)

export function computeStats(visits: Visit[], total: number, totalNeighborhoods: number): Stats {
  const counted = openVisits(visits)
  const counts: Record<string, number> = {}
  for (const visit of counted) {
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
    visited: counted.length,
    total,
    topNeighborhood,
    neighborhoodsVisited: Object.keys(counts).length,
    totalNeighborhoods,
  }
}
