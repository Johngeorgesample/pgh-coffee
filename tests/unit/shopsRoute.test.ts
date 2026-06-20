import { describe, test, expect, vi, beforeEach, beforeAll } from 'vitest'

// `order(...)` is the terminal call when no neighborhood filter is applied.
// When a neighborhood is supplied the route chains `.eq(...)` after `.order(...)`,
// so `order` returns an object that is both awaitable and exposes `eq`.
const mockOrderResult = vi.fn()
const mockEqResult = vi.fn()

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        // `order` is awaited directly when no filter is applied, and also exposes
        // `.eq` for the filtered path. Make it both thenable and chainable.
        order: () => ({
          eq: mockEqResult,
          then: (...args: unknown[]) =>
            (mockOrderResult() as Promise<unknown>).then(...(args as [never, never])),
        }),
      }),
    }),
  }),
}))

describe('Shops API Route - GET', () => {
  let GET: typeof import('@/app/api/shops/route').GET

  beforeAll(async () => {
    GET = (await import('@/app/api/shops/route')).GET
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('returns shops on success', async () => {
    const shops = [{ name: 'Test Shop', neighborhood: 'Downtown' }]
    mockOrderResult.mockResolvedValueOnce({ data: shops, error: null })

    const response = await GET(new Request('http://localhost/api/shops'))
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual(shops)
  })

  test('applies neighborhood filter when query param is present', async () => {
    const shops = [{ name: 'Filtered Shop', neighborhood: 'Lawrenceville' }]
    mockEqResult.mockResolvedValueOnce({ data: shops, error: null })

    const response = await GET(new Request('http://localhost/api/shops?neighborhood=Lawrenceville'))
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual(shops)
    expect(mockEqResult).toHaveBeenCalledWith('neighborhood', 'Lawrenceville')
  })

  test('returns 500 on database error', async () => {
    mockOrderResult.mockResolvedValueOnce({ data: null, error: { message: 'boom' } })

    const response = await GET(new Request('http://localhost/api/shops'))
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error fetching shops')
  })
})
