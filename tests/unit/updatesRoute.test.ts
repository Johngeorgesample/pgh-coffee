import { describe, test, expect, vi, beforeEach, beforeAll } from 'vitest'

// `order(...)` is terminal when no shop_id filter is applied; with a shop_id the
// route chains `.eq('shop_id', ...)` after `.order(...)`.
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

describe('Updates API Route - GET', () => {
  let GET: typeof import('@/app/api/updates/route').GET

  beforeAll(async () => {
    GET = (await import('@/app/api/updates/route')).GET
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('returns updates on success', async () => {
    const updates = [{ id: 'u1', body: 'New hours' }]
    mockOrderResult.mockResolvedValueOnce({ data: updates, error: null })

    const response = await GET(new Request('http://localhost/api/updates'))
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual(updates)
  })

  test('filters by shop_id when query param is present', async () => {
    const updates = [{ id: 'u2', shop_id: 'shop-1' }]
    mockEqResult.mockResolvedValueOnce({ data: updates, error: null })

    const response = await GET(new Request('http://localhost/api/updates?shop_id=shop-1'))
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual(updates)
    expect(mockEqResult).toHaveBeenCalledWith('shop_id', 'shop-1')
    // The body varies by shop_id, so it must not be cached on the shared CDN
    // (which keys on path only) — otherwise one shop's updates leak to all.
    expect(response.headers.get('Cache-Control') ?? '').not.toContain('s-maxage=')
  })

  test('returns 500 on database error', async () => {
    mockOrderResult.mockResolvedValueOnce({ data: null, error: { message: 'boom' } })

    const response = await GET(new Request('http://localhost/api/updates'))
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error fetching updates')
  })
})
