import { describe, test, expect, vi, beforeEach, beforeAll } from 'vitest'

const mockGetUser = vi.fn()
const mockShopsSelect = vi.fn()
const mockVisitsResult = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve({
    auth: { getUser: mockGetUser },
    from: (table: string) => {
      if (table === 'shops') {
        // Chain: select('neighborhood') — awaited directly
        return { select: mockShopsSelect }
      }
      if (table === 'user_visits') {
        // Chain: select('shop:shops (neighborhood)').eq('user_id', ...)
        return { select: () => ({ eq: mockVisitsResult }) }
      }
      return {}
    },
  })),
}))

describe('Visits Progress API Route', () => {
  let GET: typeof import('@/app/api/visits/progress/route').GET

  beforeAll(async () => {
    GET = (await import('@/app/api/visits/progress/route')).GET
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('returns 401 when not authenticated', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } })

    const response = await GET()
    expect(response.status).toBe(401)
  })

  test('computes totals and merges visits by neighborhood', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: { id: 'user-123' } } })

    // 5 shops: Bloomfield x2, Lawrenceville x2, Garfield x1
    mockShopsSelect.mockResolvedValueOnce({
      data: [
        { neighborhood: 'Bloomfield' },
        { neighborhood: 'Bloomfield' },
        { neighborhood: 'Lawrenceville' },
        { neighborhood: 'Lawrenceville' },
        { neighborhood: 'Garfield' },
      ],
      error: null,
    })

    // User visited 1 Bloomfield shop and 1 Lawrenceville shop
    mockVisitsResult.mockResolvedValueOnce({
      data: [
        { shop: { neighborhood: 'Bloomfield' } },
        { shop: { neighborhood: 'Lawrenceville' } },
      ],
      error: null,
    })

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.total).toBe(5)
    expect(data.visited).toBe(2)
    expect(data.byNeighborhood).toEqual([
      { neighborhood: 'Bloomfield', total: 2, visited: 1 },
      { neighborhood: 'Garfield', total: 1, visited: 0 },
      { neighborhood: 'Lawrenceville', total: 2, visited: 1 },
    ])
  })

  test('counts null-neighborhood shops in total but omits them from byNeighborhood', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: { id: 'user-123' } } })

    mockShopsSelect.mockResolvedValueOnce({
      data: [
        { neighborhood: 'Bloomfield' },
        { neighborhood: null },
      ],
      error: null,
    })
    mockVisitsResult.mockResolvedValueOnce({
      data: [{ shop: { neighborhood: null } }],
      error: null,
    })

    const response = await GET()
    const data = await response.json()

    expect(data.total).toBe(2)
    expect(data.visited).toBe(1)
    expect(data.byNeighborhood).toEqual([
      { neighborhood: 'Bloomfield', total: 1, visited: 0 },
    ])
  })

  test('normalizes the embedded shop relation when returned as an array', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: { id: 'user-123' } } })

    mockShopsSelect.mockResolvedValueOnce({
      data: [{ neighborhood: 'Garfield' }],
      error: null,
    })
    // PostgREST sometimes types/returns the embedded relation as an array
    mockVisitsResult.mockResolvedValueOnce({
      data: [{ shop: [{ neighborhood: 'Garfield' }] }],
      error: null,
    })

    const response = await GET()
    const data = await response.json()

    expect(data.byNeighborhood).toEqual([
      { neighborhood: 'Garfield', total: 1, visited: 1 },
    ])
  })
})
