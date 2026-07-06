import { describe, test, expect, vi, beforeEach, beforeAll } from 'vitest'

const mockShopValidationResult = vi.fn()
const mockInsertResult = vi.fn()

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: (table: string) => {
      if (table === 'shops') {
        return { select: () => ({ eq: () => ({ single: mockShopValidationResult }) }) }
      }
      if (table === 'shop_claims') {
        return { insert: mockInsertResult }
      }
      return {}
    },
  }),
}))

const validClaim = {
  shop_id: 'shop-uuid-123',
  contact_name: 'Jane Roaster',
  business_email: 'jane@example.com',
}

describe('Claim API Route - POST', () => {
  let POST: typeof import('@/app/api/shops/claim/route').POST

  beforeAll(async () => {
    POST = (await import('@/app/api/shops/claim/route')).POST
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  function post(body: unknown) {
    return POST(
      new Request('http://localhost:3000/api/shops/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    )
  }

  test('rejects a claim missing a business email before touching the database', async () => {
    const response = await post({ shop_id: 'shop-uuid-123', contact_name: 'Jane Roaster' })

    expect(response.status).toBe(400)
    expect(mockShopValidationResult).not.toHaveBeenCalled()
  })

  test('rejects a claim for a shop that does not exist', async () => {
    mockShopValidationResult.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116', message: 'No rows found' } })

    const response = await post(validClaim)

    expect(response.status).toBe(404)
    expect(mockInsertResult).not.toHaveBeenCalled()
  })

  test('surfaces a real validation error as 500, not a 404', async () => {
    mockShopValidationResult.mockResolvedValueOnce({ data: null, error: { code: '57014', message: 'query timeout' } })

    const response = await post(validClaim)

    expect(response.status).toBe(500)
    expect(mockInsertResult).not.toHaveBeenCalled()
  })

  test('persists a valid claim as pending', async () => {
    mockShopValidationResult.mockResolvedValueOnce({ data: { uuid: 'shop-uuid-123' }, error: null })
    mockInsertResult.mockResolvedValueOnce({ data: [{ id: 'claim-1' }], error: null })

    const response = await post(validClaim)

    expect(response.status).toBe(201)
    expect(mockInsertResult).toHaveBeenCalledWith([expect.objectContaining({ status: 'pending' })])
  })

  test('returns 500 when the claim insert fails', async () => {
    mockShopValidationResult.mockResolvedValueOnce({ data: { uuid: 'shop-uuid-123' }, error: null })
    mockInsertResult.mockResolvedValueOnce({ data: null, error: { message: 'insert failed' } })

    const response = await post(validClaim)

    expect(response.status).toBe(500)
  })
})
