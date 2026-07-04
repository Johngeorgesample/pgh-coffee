import { describe, test, expect, vi, beforeEach, beforeAll } from 'vitest'

// The route makes two distinct queries:
//   roaster: select().eq().single()  -> terminal single (via getRoasterBySlug)
//   shops:   select().eq()           -> terminal eq (awaited)
const mockRoasterSingle = vi.fn()
const mockShopsEq = vi.fn()
// Records the select() string used for the shops query, so a test can assert
// the roaster join is still requested.
let shopsSelect: string | undefined

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: (table: string) => ({
      select: (columns: string) => {
        if (table === 'shops') shopsSelect = columns
        return {
          eq: (...args: unknown[]) => {
            if (table === 'roaster') {
              return { single: mockRoasterSingle }
            }
            return mockShopsEq(...args)
          },
        }
      },
    }),
  }),
}))

describe('Roaster API Route - GET', () => {
  let GET: typeof import('@/app/api/roasters/[slug]/route').GET

  beforeAll(async () => {
    GET = (await import('@/app/api/roasters/[slug]/route')).GET
  })

  beforeEach(() => {
    vi.clearAllMocks()
    shopsSelect = undefined
  })

  const call = (slug: string) =>
    GET(new Request(`http://localhost/api/roasters/${slug}`) as never, {
      params: Promise.resolve({ slug }),
    })

  test('returns the roaster with its shops when found', async () => {
    const roaster = { id: 'r1', name: 'Test Roaster', slug: 'test-roaster' }
    const shops = [{ name: 'Shop A' }]
    mockRoasterSingle.mockResolvedValueOnce({ data: roaster, error: null })
    mockShopsEq.mockResolvedValueOnce({ data: shops, error: null })

    const response = await call('test-roaster')
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({ ...roaster, shops })
  })

  test('fetches the roaster join for each shop so the roaster card can render', async () => {
    const roaster = { id: 'r1', name: 'Test Roaster', slug: 'test-roaster' }
    mockRoasterSingle.mockResolvedValueOnce({ data: roaster, error: null })
    mockShopsEq.mockResolvedValueOnce({ data: [{ name: 'Shop A' }], error: null })

    await call('test-roaster')

    expect(shopsSelect).toMatch(/roasterRef:roaster_id\(/)
  })

  test('returns 404 when the roaster is not found', async () => {
    mockRoasterSingle.mockResolvedValueOnce({ data: null, error: { message: 'No rows' } })

    const response = await call('missing')
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.message).toBe('Roaster not found')
  })

  test('returns 500 when the shops query errors', async () => {
    const roaster = { id: 'r1', name: 'Test Roaster', slug: 'test-roaster' }
    mockRoasterSingle.mockResolvedValueOnce({ data: roaster, error: null })
    mockShopsEq.mockResolvedValueOnce({ data: null, error: { message: 'boom' } })

    const response = await call('test-roaster')
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error fetching roaster shops')
  })
})
