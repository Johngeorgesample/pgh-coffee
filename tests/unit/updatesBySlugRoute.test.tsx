import { describe, test, expect, vi, beforeEach, beforeAll } from 'vitest'
import { NextRequest } from 'next/server'

const mockLimit = vi.fn()

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        gte: () => ({
          lte: () => ({
            limit: mockLimit,
          }),
        }),
      }),
    }),
  }),
}))

describe('Update by-slug API Route', () => {
  let GET: typeof import('@/app/api/updates/by-slug/[slug]/route').GET

  beforeAll(async () => {
    GET = (await import('@/app/api/updates/by-slug/[slug]/route')).GET
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const update = { id: '12345678-aaaa-bbbb-cccc-111111111111', title: 'Commonplace adds a new roast' }

  const callWith = (slug: string) =>
    GET(new NextRequest(`http://localhost:3000/api/updates/by-slug/${slug}`), { params: Promise.resolve({ slug }) })

  test('resolves an update matching the id prefix in the slug', async () => {
    mockLimit.mockResolvedValueOnce({ data: [update], error: null })

    const response = await callWith('commonplace-adds-a-new-roast-12345678')
    expect(response.status).toBe(200)
    expect((await response.json()).title).toBe('Commonplace adds a new roast')
  })

  test('returns 404 without querying when the slug has no id suffix', async () => {
    const response = await callWith('not-a-real-slug')
    expect(response.status).toBe(404)
    expect(mockLimit).not.toHaveBeenCalled()
  })

  test('returns 404 when no update matches the prefix', async () => {
    mockLimit.mockResolvedValueOnce({ data: [], error: null })

    const response = await callWith('ghost-update-deadbeef')
    expect(response.status).toBe(404)
  })

  test('returns 404 on database error', async () => {
    mockLimit.mockResolvedValueOnce({ data: null, error: { message: 'Database error' } })

    const response = await callWith('whatever-12345678')
    expect(response.status).toBe(404)
  })
})
