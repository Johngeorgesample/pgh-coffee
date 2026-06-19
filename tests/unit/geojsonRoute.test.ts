import { describe, test, expect, vi, beforeEach, beforeAll } from 'vitest'

const mockOrder = vi.fn()

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({ select: () => ({ order: mockOrder }) }),
  }),
}))

describe('Shops GeoJSON API Route - GET', () => {
  let GET: typeof import('@/app/api/shops/geojson/route').GET

  beforeAll(async () => {
    const module = await import('@/app/api/shops/geojson/route')
    GET = module.GET
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('returns 500 on a Supabase error', async () => {
    mockOrder.mockResolvedValueOnce({ data: null, error: { message: 'boom' } })

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual({ error: 'Error fetching shops' })
  })

  test('returns a FeatureCollection on success', async () => {
    mockOrder.mockResolvedValueOnce({
      data: [
        {
          name: 'Test Shop',
          neighborhood: 'Downtown',
          address: '123 Main St',
          website: 'https://example.com',
          uuid: 'shop-1',
          longitude: -79.925,
          latitude: 40.4363,
        },
      ],
      error: null,
    })

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.type).toBe('FeatureCollection')
    expect(data.features[0].properties.uuid).toBe('shop-1')
    expect(data.features[0].geometry.coordinates).toEqual([-79.925, 40.4363])
  })
})
