import { describe, test, expect, vi, beforeEach, beforeAll } from 'vitest'

const mockOrderResult = vi.fn()

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        order: mockOrderResult,
      }),
    }),
  }),
}))

describe('Curated Lists API Route - GET', () => {
  let GET: typeof import('@/app/api/curated-lists/route').GET

  beforeAll(async () => {
    const module = await import('@/app/api/curated-lists/route')
    GET = module.GET
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const baseShop = {
    name: 'Test Shop',
    neighborhood: 'Downtown',
    address: '123 Main St',
    company: null,
    photo: null,
    photos: null,
    website: 'https://example.com',
    uuid: 'shop-1',
    latitude: 40.4363,
    longitude: -79.925,
  }

  test('returns curated lists with shops formatted as map features', async () => {
    mockOrderResult.mockResolvedValueOnce({
      data: [
        {
          id: 'list-1',
          title: 'Best Patios',
          description: 'Great outdoor seating',
          featured: true,
          shops: [baseShop],
        },
      ],
      error: null,
    })

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    // List metadata is passed through and each shop becomes a GeoJSON Feature.
    expect(data).toHaveLength(1)
    expect(data[0]).toMatchObject({ id: 'list-1', title: 'Best Patios', featured: true })
    expect(data[0].shops[0]).toMatchObject({
      type: 'Feature',
      properties: { uuid: 'shop-1' },
      geometry: { coordinates: [-79.925, 40.4363] },
    })
  })

  test('filters out shops with missing coordinates', async () => {
    mockOrderResult.mockResolvedValueOnce({
      data: [
        {
          id: 'list-1',
          title: 'Best Patios',
          shops: [baseShop, { ...baseShop, uuid: 'shop-2', latitude: null, longitude: null }],
        },
      ],
      error: null,
    })

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data[0].shops).toHaveLength(1)
    expect(data[0].shops[0].properties.uuid).toBe('shop-1')
  })

  test('handles lists with no shops', async () => {
    mockOrderResult.mockResolvedValueOnce({
      data: [{ id: 'list-1', title: 'Empty List', shops: null }],
      error: null,
    })

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data[0].shops).toEqual([])
  })

  test('returns 500 on database error', async () => {
    mockOrderResult.mockResolvedValueOnce({
      data: null,
      error: { message: 'Database error' },
    })

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error fetching curated lists')
  })
})
