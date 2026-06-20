import { describe, test, expect, vi, beforeEach, beforeAll } from 'vitest'

const mockSingleResult = vi.fn()

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          single: mockSingleResult,
        }),
      }),
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
  })

  const call = (slug: string) =>
    GET(new Request(`http://localhost/api/roasters/${slug}`) as never, {
      params: Promise.resolve({ slug }),
    })

  test('returns the roaster when found', async () => {
    const roaster = { id: 'r1', name: 'Test Roaster', slug: 'test-roaster' }
    mockSingleResult.mockResolvedValueOnce({ data: roaster, error: null })

    const response = await call('test-roaster')
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual(roaster)
  })

  test('returns 404 when the roaster is not found', async () => {
    mockSingleResult.mockResolvedValueOnce({ data: null, error: { message: 'No rows' } })

    const response = await call('missing')
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.message).toBe('Roaster not found')
  })
})
