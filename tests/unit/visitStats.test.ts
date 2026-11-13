import { describe, it, expect } from 'vitest'
import { computeStats, type Visit } from '@/app/utils/visitStats'
import type { DbShop } from '@/types/shop-types'

const visit = (id: string, neighborhood: string, permanently_closed = false): Visit => ({
  id,
  created_at: '2026-09-01T00:00:00Z',
  shop: { name: id, neighborhood, permanently_closed } as unknown as DbShop,
})

describe('computeStats', () => {
  it('excludes visits to permanently closed shops from the count', () => {
    const visits = [visit('a', 'Larimer'), visit('b', 'Bloomfield'), visit('c', 'Larimer', true)]

    const stats = computeStats(visits, 2, 2)

    expect(stats.visited).toBe(2)
    expect(stats.visited).toBeLessThanOrEqual(stats.total)
    expect(stats.neighborhoodsVisited).toBe(2)
  })

  it('drops a neighborhood whose only visit was to a closed shop', () => {
    const stats = computeStats([visit('a', 'Larimer'), visit('b', 'Pitcairn', true)], 10, 10)

    expect(stats.neighborhoodsVisited).toBe(1)
    expect(stats.topNeighborhood).toBe('Larimer')
  })
})
