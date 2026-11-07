import { describe, test, expect, vi, beforeEach, beforeAll } from 'vitest'

const mockInsert = vi.fn()

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      insert: mockInsert,
    }),
  }),
}))

describe('Shops Submit API Route - POST', () => {
  let POST: typeof import('@/app/api/shops/submit/route').POST

  beforeAll(async () => {
    POST = (await import('@/app/api/shops/submit/route')).POST
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const makeRequest = (body: unknown) =>
    new Request('http://localhost/api/shops/submit', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'content-type': 'application/json' },
    })

  test('returns 400 when name is missing', async () => {
    const response = await POST(makeRequest({ address: '123 Main St' }))
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Missing required fields')
    expect(mockInsert).not.toHaveBeenCalled()
  })

  test('returns 400 when address is missing', async () => {
    const response = await POST(makeRequest({ name: 'Test Shop' }))
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Missing required fields')
    expect(mockInsert).not.toHaveBeenCalled()
  })

  test('returns 201 with inserted data on success', async () => {
    const inserted = [{ name: 'Test Shop', address: '123 Main St' }]
    mockInsert.mockResolvedValueOnce({ data: inserted, error: null })

    const response = await POST(
      makeRequest({ name: 'Test Shop', address: '123 Main St', neighborhood: 'Downtown', website: 'https://x.com' }),
    )
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data).toEqual(inserted)
    expect(mockInsert).toHaveBeenCalledWith([
      { name: 'Test Shop', address: '123 Main St', neighborhood: 'Downtown', website: 'https://x.com' },
    ])
  })

  test('returns 500 when insert fails', async () => {
    mockInsert.mockResolvedValueOnce({ data: null, error: { message: 'boom' } })

    const response = await POST(makeRequest({ name: 'Test Shop', address: '123 Main St' }))
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error adding shop')
  })
})
