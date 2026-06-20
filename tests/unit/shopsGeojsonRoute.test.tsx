import { describe, test, expect, vi, beforeEach, beforeAll } from 'vitest'

const mockOrder = vi.fn()

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        order: mockOrder,
      }),
    }),
  }),
}))

describe('Shops GeoJSON API Route', () => {
  let GET: typeof import('@/app/api/shops/geojson/route').GET

  beforeAll(async () => {
    const module = await import('@/app/api/shops/geojson/route')
    GET = module.GET
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('returns CDN-cacheable GeoJSON on success', async () => {
    mockOrder.mockResolvedValueOnce({
      data: [{
        name: 'Test Coffee',
        neighborhood: 'Downtown',
        website: 'https://example.com',
        address: '123 Main St',
        uuid: '1',
        latitude: 40.4363,
        longitude: -79.925,
        company: null,
      }],
      error: null,
    })

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.features).toHaveLength(1)
    expect(response.headers.get('Cache-Control')).toContain('s-maxage=300')
  })

  test('a DB error returns an uncacheable 500, not a cacheable empty map', async () => {
    mockOrder.mockResolvedValueOnce({
      data: null,
      error: { message: 'Database error' },
    })

    const response = await GET()

    expect(response.status).toBe(500)
    // A transient outage must not be pinned in the shared CDN cache as "no shops".
    expect(response.headers.get('Cache-Control') ?? '').not.toContain('s-maxage=')
  })
})
