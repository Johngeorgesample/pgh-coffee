import { describe, test, expect, vi, beforeEach, beforeAll } from 'vitest'

// Create mock functions for the Supabase chains
const mockShopValidationResult = vi.fn()
const mockInsertResult = vi.fn()

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: (table: string) => {
      if (table === 'shops') {
        // Chain: select().eq().single()
        return {
          select: () => ({
            eq: () => ({
              single: mockShopValidationResult,
            }),
          }),
        }
      }
      if (table === 'shop_reports') {
        // Chain: insert()
        return {
          insert: mockInsertResult,
        }
      }
      return {}
    },
  }),
}))

describe('Report API Route - POST', () => {
  let POST: typeof import('@/app/api/shops/report/route').POST

  beforeAll(async () => {
    const module = await import('@/app/api/shops/report/route')
    POST = module.POST
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('successfully submits a report with changed fields', async () => {
    mockShopValidationResult.mockResolvedValueOnce({
      data: { uuid: 'shop-uuid-123' },
      error: null,
    })
    mockInsertResult.mockResolvedValueOnce({
      data: [{ id: 'report-1' }],
      error: null,
    })

    const request = new Request('http://localhost:3000/api/shops/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shop_id: 'shop-uuid-123',
        reported_name: 'Updated Coffee Shop',
      }),
    })

    const response = await POST(request)

    expect(response.status).toBe(201)
  })

  test('returns 400 when shop_id is missing', async () => {
    const request = new Request('http://localhost:3000/api/shops/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reported_name: 'Updated Coffee Shop',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Missing shop_id')
  })

  test('returns 404 when shop_id does not exist', async () => {
    mockShopValidationResult.mockResolvedValueOnce({
      data: null,
      error: { message: 'No rows found' },
    })

    const request = new Request('http://localhost:3000/api/shops/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shop_id: 'nonexistent-uuid',
        reported_name: 'Updated Coffee Shop',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Shop not found')
  })

  test('returns 404 when shop validation returns no data', async () => {
    mockShopValidationResult.mockResolvedValueOnce({
      data: null,
      error: null,
    })

    const request = new Request('http://localhost:3000/api/shops/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shop_id: 'invalid-uuid',
        reported_name: 'Updated Coffee Shop',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Shop not found')
  })

  test('returns 500 on Supabase insert failure', async () => {
    mockShopValidationResult.mockResolvedValueOnce({
      data: { uuid: 'shop-uuid-123' },
      error: null,
    })
    mockInsertResult.mockResolvedValueOnce({
      data: null,
      error: { message: 'Database error' },
    })

    const request = new Request('http://localhost:3000/api/shops/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shop_id: 'shop-uuid-123',
        reported_name: 'Updated Coffee Shop',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error submitting report')
  })
})
