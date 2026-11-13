import { describe, test, expect, vi, beforeEach, beforeAll } from 'vitest'

const mockMaybeSingle = vi.fn()
let selected: string | undefined
const filters: unknown[][] = []

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      select: (columns: string) => {
        selected = columns
        const chain = {
          eq: (...args: unknown[]) => {
            filters.push(args)
            return chain
          },
          maybeSingle: mockMaybeSingle,
        }
        return chain
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
    selected = undefined
    filters.length = 0
  })

  const call = (slug: string) =>
    GET(new Request(`http://localhost/api/roasters/${slug}`) as never, {
      params: Promise.resolve({ slug }),
    })

  test('returns the roaster with its shops when found', async () => {
    const roaster = { id: 'r1', name: 'Test Roaster', slug: 'test-roaster', shops: [{ name: 'Shop A' }] }
    mockMaybeSingle.mockResolvedValueOnce({ data: roaster, error: null })

    const response = await call('test-roaster')

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(roaster)
  })

  test('marks the roaster verified when its owning company is verified', async () => {
    const roaster = { id: 'r1', name: 'Test Roaster', is_verified: false, company: { is_verified: true }, shops: [] }
    mockMaybeSingle.mockResolvedValueOnce({ data: roaster, error: null })

    const data = await (await call('test-roaster')).json()

    expect(data.is_verified).toBe(true)
  })

  test('embeds open shops with their roaster join so the roaster card can render', async () => {
    mockMaybeSingle.mockResolvedValueOnce({ data: { id: 'r1', shops: [] }, error: null })

    await call('test-roaster')

    expect(selected).toMatch(/shops!roaster_id\(.*roasterRef:roaster_id\(/)
    expect(filters).toContainEqual(['shops.permanently_closed', false])
  })

  test('returns 404 when the roaster is not found', async () => {
    mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null })

    const response = await call('missing')

    expect(response.status).toBe(404)
    expect((await response.json()).message).toBe('Roaster not found')
  })

  test('returns 500, not 404, when the query errors', async () => {
    mockMaybeSingle.mockResolvedValueOnce({ data: null, error: { message: 'boom' } })

    const response = await call('test-roaster')

    expect(response.status).toBe(500)
  })
})
