import { describe, test, expect, vi, beforeEach, beforeAll } from 'vitest'

const mockOrder = vi.fn()
const mockIn = vi.fn(() => ({ order: mockOrder }))
const mockSelect = vi.fn((_select: string) => ({ in: mockIn }))

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      select: mockSelect,
    }),
  }),
}))

describe('Shops Batch API Route - GET', () => {
  let GET: typeof import('@/app/api/shops/batch/route').GET

  beforeAll(async () => {
    GET = (await import('@/app/api/shops/batch/route')).GET
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('returns 400 when ids param is missing', async () => {
    const response = await GET(new Request('http://localhost/api/shops/batch'))
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Missing ids parameter')
  })

  test('returns an empty FeatureCollection when ids param has no usable ids', async () => {
    const response = await GET(new Request('http://localhost/api/shops/batch?ids=,,'))
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.features).toEqual([])
    expect(mockSelect).not.toHaveBeenCalled()
  })

  test('queries the roaster join and surfaces it on each shop', async () => {
    mockOrder.mockResolvedValueOnce({
      data: [{
        name: 'Test Coffee',
        neighborhood: 'Downtown',
        website: 'https://example.com',
        address: '123 Main St',
        uuid: 'shop-1',
        latitude: 40.4363,
        longitude: -79.925,
        company: null,
        roasterRef: { name: 'Test Roasters', slug: 'test-roasters', company_id: null },
      }],
      error: null,
    })

    const response = await GET(new Request('http://localhost/api/shops/batch?ids=shop-1'))
    const data = await response.json()

    const [selectArg] = mockSelect.mock.calls[0]
    expect(selectArg).toContain('roasterRef:roaster_id')

    expect(response.status).toBe(200)
    expect(data.features[0].properties.roaster).toEqual({
      name: 'Test Roasters',
      slug: 'test-roasters',
      inHouse: false,
    })
  })

  test('returns 500 on database error', async () => {
    mockOrder.mockResolvedValueOnce({ data: null, error: { message: 'boom' } })

    const response = await GET(new Request('http://localhost/api/shops/batch?ids=shop-1'))
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error fetching shops')
  })
})
