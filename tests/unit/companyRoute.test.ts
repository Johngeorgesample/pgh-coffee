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

describe('Company API Route - GET', () => {
  let GET: typeof import('@/app/api/companies/[company]/route').GET

  beforeAll(async () => {
    GET = (await import('@/app/api/companies/[company]/route')).GET
  })

  beforeEach(() => {
    vi.clearAllMocks()
    selected = undefined
    filters.length = 0
  })

  const call = (slug: string) =>
    GET(new Request(`http://localhost/api/companies/${slug}`) as never, {
      params: Promise.resolve({ company: slug }),
    })

  test('returns the company with its shops and its roaster as a single object', async () => {
    const company = { id: 'c1', name: 'Test Co', slug: 'test-co', shops: [{ name: 'Shop A' }] }
    const roaster = { name: 'Test Roasters', slug: 'test-roasters' }
    mockMaybeSingle.mockResolvedValueOnce({ data: { ...company, roaster: [roaster] }, error: null })

    const response = await call('test-co')

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ ...company, roaster })
  })

  test('returns a null roaster when the company has none', async () => {
    mockMaybeSingle.mockResolvedValueOnce({ data: { id: 'c1', shops: [], roaster: [] }, error: null })

    const data = await (await call('test-co')).json()

    expect(data.roaster).toBeNull()
  })

  test('embeds open shops with the roasterRef join for the roasts section', async () => {
    mockMaybeSingle.mockResolvedValueOnce({ data: { id: 'c1', shops: [], roaster: [] }, error: null })

    await call('test-co')

    expect(selected).toContain('roasterRef:roaster_id(name, slug, company_id)')
    expect(filters).toContainEqual(['shops.permanently_closed', false])
  })

  test('returns 404 when the company is not found', async () => {
    mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null })

    const response = await call('missing')

    expect(response.status).toBe(404)
    expect((await response.json()).message).toBe('Company not found')
  })

  test('returns 500, not 404, when the query errors', async () => {
    mockMaybeSingle.mockResolvedValueOnce({ data: null, error: { message: 'boom' } })

    const response = await call('test-co')

    expect(response.status).toBe(500)
  })
})
