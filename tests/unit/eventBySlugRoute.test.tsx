import { describe, test, expect, vi, beforeEach, beforeAll } from 'vitest'
import { NextRequest } from 'next/server'

const mockLimit = vi.fn()

// getEventByIdPrefix filters in the query via
// .select(...).like('id', `${prefix}%`).limit(1), so the chain resolves at .limit().
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        like: () => ({
          limit: mockLimit,
        }),
      }),
    }),
  }),
}))

describe('Event by-slug API Route', () => {
  let GET: typeof import('@/app/api/events/by-slug/[slug]/route').GET

  beforeAll(async () => {
    GET = (await import('@/app/api/events/by-slug/[slug]/route')).GET
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const event = { id: '12345678-aaaa-bbbb-cccc-111111111111', title: 'Latte Throwdown' }

  const callWith = (slug: string) =>
    GET(new NextRequest(`http://localhost:3000/api/events/by-slug/${slug}`), { params: Promise.resolve({ slug }) })

  test('resolves an event matching the id prefix in the slug', async () => {
    mockLimit.mockResolvedValueOnce({ data: [event], error: null })

    const response = await callWith('latte-throwdown-12345678')
    expect(response.status).toBe(200)
    expect((await response.json()).title).toBe('Latte Throwdown')
  })

  test('returns 404 without querying when the slug has no id suffix', async () => {
    const response = await callWith('not-a-real-slug')
    expect(response.status).toBe(404)
    expect(mockLimit).not.toHaveBeenCalled()
  })

  test('returns 404 when no event matches the prefix', async () => {
    mockLimit.mockResolvedValueOnce({ data: [], error: null })

    const response = await callWith('ghost-event-deadbeef')
    expect(response.status).toBe(404)
  })

  test('returns 404 on database error', async () => {
    mockLimit.mockResolvedValueOnce({ data: null, error: { message: 'Database error' } })

    const response = await callWith('whatever-12345678')
    expect(response.status).toBe(404)
  })
})
