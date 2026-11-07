import { describe, test, expect, vi, beforeEach, beforeAll } from 'vitest'

const mockSingleResult = vi.fn()
const mockEq = vi.fn()

vi.mock('@supabase/supabase-js', () => {
  const builder: Record<string, unknown> = {
    select: vi.fn(() => builder),
    eq: (...args: unknown[]) => {
      mockEq(...args)
      return builder
    },
    single: () => mockSingleResult(),
  }

  return { createClient: () => ({ from: () => builder }) }
})

describe('Event By Id API Route - GET', () => {
  let GET: typeof import('@/app/api/events/[eventId]/route').GET

  beforeAll(async () => {
    const module = await import('@/app/api/events/[eventId]/route')
    GET = module.GET
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('returns the event when found', async () => {
    const mockEvent = { id: 'event-1', title: 'Latte Art Class' }
    mockSingleResult.mockResolvedValueOnce({ data: mockEvent, error: null })

    const request = new Request('http://localhost:3000/api/events/event-1')
    const params = Promise.resolve({ eventId: 'event-1' })

    const response = await GET(request as never, { params })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual(mockEvent)
  })

  test('marks the roaster verified via its owning company', async () => {
    const roaster = { name: 'Commonplace', is_verified: false, company: { is_verified: true } }
    mockSingleResult.mockResolvedValueOnce({ data: { id: 'event-1', roaster }, error: null })

    const response = await GET(new Request('http://localhost:3000/api/events/event-1') as never, {
      params: Promise.resolve({ eventId: 'event-1' }),
    })
    expect((await response.json()).roaster.is_verified).toBe(true)
  })

  test('returns 404 when the event is not found', async () => {
    mockSingleResult.mockResolvedValueOnce({ data: null, error: { message: 'No rows found' } })

    const request = new Request('http://localhost:3000/api/events/missing')
    const params = Promise.resolve({ eventId: 'missing' })

    const response = await GET(request as never, { params })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Event not found')
  })

  test('excludes hidden events', async () => {
    mockSingleResult.mockResolvedValueOnce({ data: null, error: { message: 'No rows found' } })

    await GET(new Request('http://localhost:3000/api/events/event-1') as never, {
      params: Promise.resolve({ eventId: 'event-1' }),
    })

    expect(mockEq).toHaveBeenCalledWith('is_hidden', false)
  })
})
