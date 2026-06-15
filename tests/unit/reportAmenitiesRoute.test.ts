import { describe, test, expect, vi, beforeEach, beforeAll } from 'vitest'

const mockShopValidationResult = vi.fn()
const mockInsertResult = vi.fn()

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: (table: string) => {
      if (table === 'shops') {
        return {
          select: () => ({
            eq: () => ({
              single: mockShopValidationResult,
            }),
          }),
        }
      }
      if (table === 'amenity_reports') {
        return {
          insert: mockInsertResult,
        }
      }
      return {}
    },
  }),
}))

describe('Amenity Report API Route - POST', () => {
  let POST: typeof import('@/app/api/shops/report-amenities/route').POST

  beforeAll(async () => {
    const module = await import('@/app/api/shops/report-amenities/route')
    POST = module.POST
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('successfully submits an amenity report', async () => {
    mockShopValidationResult.mockResolvedValueOnce({
      data: { uuid: 'shop-uuid-123' },
      error: null,
    })
    mockInsertResult.mockResolvedValueOnce({
      data: [{ id: 'report-1' }],
      error: null,
    })

    const request = new Request('http://localhost:3000/api/shops/report-amenities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shop_id: 'shop-uuid-123',
        amenities: ['free_wifi', 'patio_seating'],
      }),
    })

    const response = await POST(request)

    expect(response.status).toBe(201)
  })

  test('returns 400 when shop_id is missing', async () => {
    const request = new Request('http://localhost:3000/api/shops/report-amenities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amenities: ['free_wifi'] }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Missing shop_id or amenities')
  })

  test('returns 400 when amenities is not an array', async () => {
    const request = new Request('http://localhost:3000/api/shops/report-amenities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shop_id: 'shop-uuid-123', amenities: 'free_wifi' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Missing shop_id or amenities')
  })

  test('returns 400 when amenities contains an unknown value', async () => {
    const request = new Request('http://localhost:3000/api/shops/report-amenities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shop_id: 'shop-uuid-123',
        amenities: ['free_wifi', 'not_a_real_amenity'],
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid amenity value')
  })

  test('returns 404 when shop_id does not exist', async () => {
    mockShopValidationResult.mockResolvedValueOnce({
      data: null,
      error: { code: 'PGRST116', message: 'No rows found' },
    })

    const request = new Request('http://localhost:3000/api/shops/report-amenities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shop_id: 'nonexistent-uuid',
        amenities: ['free_wifi'],
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Shop not found')
  })

  test('returns 500 when the shop lookup itself fails', async () => {
    mockShopValidationResult.mockResolvedValueOnce({
      data: null,
      error: { code: '08006', message: 'connection failure' },
    })

    const request = new Request('http://localhost:3000/api/shops/report-amenities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shop_id: 'shop-uuid-123',
        amenities: ['free_wifi'],
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error validating shop')
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

    const request = new Request('http://localhost:3000/api/shops/report-amenities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shop_id: 'shop-uuid-123',
        amenities: ['free_wifi'],
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error submitting amenity report')
  })

  test('accepts an empty amenities array', async () => {
    mockShopValidationResult.mockResolvedValueOnce({
      data: { uuid: 'shop-uuid-123' },
      error: null,
    })
    mockInsertResult.mockResolvedValueOnce({
      data: [{ id: 'report-1' }],
      error: null,
    })

    const request = new Request('http://localhost:3000/api/shops/report-amenities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shop_id: 'shop-uuid-123', amenities: [] }),
    })

    const response = await POST(request)

    expect(response.status).toBe(201)
  })
})
