import { describe, test, expect, vi, beforeEach, beforeAll } from 'vitest'

const mockEq = vi.fn()
const mockResult = vi.fn()

vi.mock('@supabase/supabase-js', () => {
  const builder: Record<string, unknown> = {
    select: vi.fn(() => builder),
    order: vi.fn(() => builder),
    eq: (...args: unknown[]) => {
      mockEq(...args)
      return builder
    },
    then: (resolve: (value: unknown) => unknown, reject: (reason: unknown) => unknown) =>
      Promise.resolve(mockResult()).then(resolve, reject),
  }

  return {
    createClient: () => ({
      from: () => builder,
    }),
  }
})

describe('Events API Route - GET', () => {
  let GET: typeof import('@/app/api/events/route').GET

  beforeAll(async () => {
    const module = await import('@/app/api/events/route')
    GET = module.GET
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('returns all visible events when no filters are provided', async () => {
    const mockEvents = [{ id: 'event-1', title: 'Latte Art Class' }]
    mockResult.mockReturnValueOnce({ data: mockEvents, error: null })

    const request = new Request('http://localhost:3000/api/events')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual(mockEvents)
    // Successful event responses are safe for the shared CDN to cache.
    expect(response.headers.get('Cache-Control')).toContain('s-maxage=60')
    expect(mockEq).toHaveBeenCalledWith('is_hidden', false)
    expect(mockEq).not.toHaveBeenCalledWith('shop_id', expect.anything())
    expect(mockEq).not.toHaveBeenCalledWith('roaster_id', expect.anything())
  })

  test('filters by shop_id when provided', async () => {
    mockResult.mockReturnValueOnce({ data: [], error: null })

    const request = new Request('http://localhost:3000/api/events?shop_id=shop-123')
    const response = await GET(request)

    expect(response.status).toBe(200)
    expect(mockEq).toHaveBeenCalledWith('shop_id', 'shop-123')
  })

  test('filters by roaster_id when provided', async () => {
    mockResult.mockReturnValueOnce({ data: [], error: null })

    const request = new Request('http://localhost:3000/api/events?roaster_id=roaster-456')
    const response = await GET(request)

    expect(response.status).toBe(200)
    expect(mockEq).toHaveBeenCalledWith('roaster_id', 'roaster-456')
  })

  test('returns 500 on database error', async () => {
    mockResult.mockReturnValueOnce({ data: null, error: { message: 'Database error' } })

    const request = new Request('http://localhost:3000/api/events')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error fetching events')
    // A database error must not be pinned in the shared CDN cache.
    expect(response.headers.get('Cache-Control') ?? '').not.toContain('s-maxage=')
  })
})
