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

  const post = (body: Record<string, unknown>) =>
    POST(
      new Request('http://localhost:3000/api/shops/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
    )

  const shopExists = () =>
    mockShopValidationResult.mockResolvedValueOnce({ data: { uuid: 'shop-uuid-123' }, error: null })

  beforeAll(async () => {
    const module = await import('@/app/api/shops/report/route')
    POST = module.POST
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('successfully submits an hours report', async () => {
    shopExists()
    mockInsertResult.mockResolvedValueOnce({ data: [{ id: 'report-1' }], error: null })

    const response = await post({
      shop_id: 'shop-uuid-123',
      report_type: 'hours',
      details: 'Closes at 3pm on Sundays',
    })

    expect(response.status).toBe(201)
  })

  test('a closed report needs no details', async () => {
    shopExists()
    mockInsertResult.mockResolvedValueOnce({ data: [{ id: 'report-2' }], error: null })

    const response = await post({ shop_id: 'shop-uuid-123', report_type: 'closed' })

    expect(response.status).toBe(201)
  })

  test('returns 400 when shop_id is missing', async () => {
    const response = await post({ report_type: 'closed' })
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Missing shop_id')
  })

  test('returns 400 for an unknown report_type', async () => {
    const response = await post({ shop_id: 'shop-uuid-123', report_type: 'bogus' })
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid report_type')
  })

  test('returns 400 when report_type is missing entirely', async () => {
    const response = await post({ shop_id: 'shop-uuid-123' })

    expect(response.status).toBe(400)
  })

  // The old route accepted these, which is how the table collected rows saying a
  // shop was wrong without saying how.
  test('returns 400 when an hours report has only whitespace for details', async () => {
    const response = await post({ shop_id: 'shop-uuid-123', report_type: 'hours', details: '   ' })
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Missing details')
  })

  test('returns 400 when a website report has no website', async () => {
    const response = await post({ shop_id: 'shop-uuid-123', report_type: 'website' })
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Missing reported_website')
  })

  test('returns 404 when shop_id does not exist', async () => {
    mockShopValidationResult.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116', message: 'No rows found' } })

    const response = await post({ shop_id: 'nonexistent-uuid', report_type: 'closed' })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Shop not found')
  })

  test('returns 404 when shop validation returns no data', async () => {
    mockShopValidationResult.mockResolvedValueOnce({ data: null, error: null })

    const response = await post({ shop_id: 'invalid-uuid', report_type: 'closed' })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Shop not found')
  })

  // Regression for S11a: the route used to treat any Supabase error as "not
  // found," so a real DB failure during shop validation was reported as a 404
  // instead of the 500 it actually is.
  test('returns 500, not 404, when shop validation fails for a reason other than no rows', async () => {
    mockShopValidationResult.mockResolvedValueOnce({ data: null, error: { code: '500', message: 'connection refused' } })

    const response = await post({ shop_id: 'shop-uuid-123', report_type: 'closed' })
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error validating shop')
  })

  // An error with no `code` at all is not PGRST116, so it must be treated as a
  // real failure the same as any other non-PGRST116 error.
  test('returns 500 when a Supabase error has no code at all', async () => {
    mockShopValidationResult.mockResolvedValueOnce({ data: null, error: { message: 'unexpected' } })

    const response = await post({ shop_id: 'shop-uuid-123', report_type: 'closed' })
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error validating shop')
  })

  test('returns 500 on Supabase insert failure', async () => {
    shopExists()
    mockInsertResult.mockResolvedValueOnce({ data: null, error: { message: 'Database error' } })

    const response = await post({ shop_id: 'shop-uuid-123', report_type: 'closed' })
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error submitting report')
  })
})
