import { describe, test, expect, vi, beforeEach, beforeAll } from 'vitest'

// The route makes three distinct queries:
//   companies: select().eq().single()        -> terminal single
//   shops:     select().eq()                 -> terminal eq (awaited)
//   roaster:   select().eq().maybeSingle()   -> terminal maybeSingle
const mockCompanySingle = vi.fn()
const mockShopsEq = vi.fn()
const mockRoasterMaybeSingle = vi.fn()

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: (table: string) => ({
      select: () => ({
        eq: (...args: unknown[]) => {
          if (table === 'companies') {
            return { single: mockCompanySingle }
          }
          if (table === 'roaster') {
            return { maybeSingle: mockRoasterMaybeSingle }
          }
          return mockShopsEq(...args)
        },
      }),
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
  })

  const call = (slug: string) =>
    GET(new Request(`http://localhost/api/companies/${slug}`) as never, {
      params: Promise.resolve({ company: slug }),
    })

  test('returns the company with its shops and roaster when found', async () => {
    const company = { id: 'c1', name: 'Test Co', slug: 'test-co' }
    const shops = [{ name: 'Shop A' }]
    const roaster = { name: 'Test Roasters', slug: 'test-roasters' }
    mockCompanySingle.mockResolvedValueOnce({ data: company, error: null })
    mockShopsEq.mockResolvedValueOnce({ data: shops, error: null })
    mockRoasterMaybeSingle.mockResolvedValueOnce({ data: roaster, error: null })

    const response = await call('test-co')
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({ ...company, shops, roaster })
  })

  test('returns 404 when the company is not found', async () => {
    mockCompanySingle.mockResolvedValueOnce({ data: null, error: { message: 'No rows' } })

    const response = await call('missing')
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.message).toBe('Company not found')
  })

  test('returns 500 when the shops query errors', async () => {
    const company = { id: 'c1', name: 'Test Co', slug: 'test-co' }
    mockCompanySingle.mockResolvedValueOnce({ data: company, error: null })
    mockShopsEq.mockResolvedValueOnce({ data: null, error: { message: 'boom' } })

    const response = await call('test-co')
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error fetching company shops')
  })
})
