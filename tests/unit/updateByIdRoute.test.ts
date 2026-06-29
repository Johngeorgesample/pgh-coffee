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

describe('Update By Id API Route - GET', () => {
  let GET: typeof import('@/app/api/updates/[id]/route').GET

  beforeAll(async () => {
    GET = (await import('@/app/api/updates/[id]/route')).GET
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const call = (id: string) =>
    GET(new Request(`http://localhost/api/updates/${id}`) as never, {
      params: Promise.resolve({ id }),
    })

  test('returns the update when found', async () => {
    const update = { id: 'u1', body: 'New hours' }
    mockSingleResult.mockResolvedValueOnce({ data: update, error: null })

    const response = await call('u1')
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual(update)
  })

  test('returns 404 when the update is not found', async () => {
    mockSingleResult.mockResolvedValueOnce({ data: null, error: { message: 'No rows' } })

    const response = await call('missing')
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Update not found')
  })
})
