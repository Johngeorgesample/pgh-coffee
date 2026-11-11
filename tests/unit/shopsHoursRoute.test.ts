import { describe, test, expect, vi, beforeAll } from 'vitest'

const mockRange = vi.fn()

vi.mock('@supabase/supabase-js', () => {
  const query = { select: () => query, order: () => query, range: mockRange }
  return { createClient: () => ({ from: () => query }) }
})

vi.mock('@/lib/metrics', () => ({ metrics: { requestCompleted: vi.fn() } }))

const row = (shop_uuid: string, day_of_week: number) => ({
  shop_uuid,
  day_of_week,
  opens_at: '07:00:00',
  closes_at: '17:00:00',
  spans_midnight: false,
})

describe('Shop hours API route - GET', () => {
  let GET: typeof import('@/app/api/shops/hours/route').GET

  beforeAll(async () => {
    GET = (await import('@/app/api/shops/hours/route')).GET
  })

  test('keeps paging past the 1000-row cap so no shop loses its hours', async () => {
    const firstPage = Array.from({ length: 1000 }, (_, i) => row('shop-a', i % 7))
    mockRange
      .mockResolvedValueOnce({ data: firstPage, error: null })
      .mockResolvedValueOnce({ data: [row('shop-b', 2)], error: null })

    const data = await (await GET()).json()

    expect(Object.keys(data)).toEqual(['shop-a', 'shop-b'])
    expect(data['shop-b']).toEqual([{ day_of_week: 2, opens_at: '07:00:00', closes_at: '17:00:00', spans_midnight: false }])
  })
})
