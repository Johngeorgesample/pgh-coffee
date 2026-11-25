import { describe, test, expect, vi, beforeEach } from 'vitest'
import { PUT } from '@/app/api/journal/[coffeeId]/route'

const mockGetUser = vi.fn()
const mockUpsert = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve({
    auth: { getUser: mockGetUser },
    from: () => ({ upsert: mockUpsert }),
  })),
}))

const put = (coffeeId: string, cup: object) =>
  PUT(
    new Request(`http://localhost/api/journal/${coffeeId}`, { method: 'PUT', body: JSON.stringify(cup) }),
    { params: Promise.resolve({ coffeeId }) },
  )

const cup = { rating: 4, tasted: ['Cocoa'], method: 'AeroPress', body: '' }

describe('PUT /api/journal/[coffeeId]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } })
    mockUpsert.mockResolvedValue({ error: null })
  })

  test('saves a valid cup for a day in the lineup', async () => {
    expect((await put('advent-2026-1', cup)).status).toBe(200)
  })

  test.each(['advent-2026-26', 'advent-2025-1', 'advent-2026-01', 'whatever'])('rejects unknown coffee %s', async coffeeId => {
    expect((await put(coffeeId, cup)).status).toBe(400)
    expect(mockUpsert).not.toHaveBeenCalled()
  })

  test.each([0, 6, 3.5, '4', null])('rejects rating %s', async rating => {
    expect((await put('advent-2026-1', { ...cup, rating })).status).toBe(400)
    expect(mockUpsert).not.toHaveBeenCalled()
  })
})
