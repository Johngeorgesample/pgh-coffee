import { describe, test, expect, vi, beforeEach, beforeAll } from 'vitest'

const mockEntityValidation = vi.fn()
const mockInsertResult = vi.fn()

// The route validates the target against its entity table (shops/companies/roaster)
// and inserts into `claims`. Any non-claims table stands in for the validation lookup.
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: (table: string) => {
      if (table === 'claims') {
        return { insert: mockInsertResult }
      }
      return { select: () => ({ eq: () => ({ single: mockEntityValidation }) }) }
    },
  }),
}))

const SHOP_ID = '11111111-1111-1111-1111-111111111111'
const COMPANY_ID = '22222222-2222-2222-2222-222222222222'

const validClaim = {
  claim_type: 'shop',
  target_id: SHOP_ID,
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

  test('rejects an invalid JSON body with 400', async () => {
    const response = await POST(
      new Request('http://localhost:3000/api/shops/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{not valid json',
      })
    )

    expect(response.status).toBe(400)
    expect(mockEntityValidation).not.toHaveBeenCalled()
  })

  test('rejects a claim missing a business email before touching the database', async () => {
    const response = await post({ claim_type: 'shop', target_id: SHOP_ID, contact_name: 'Jane' })

    expect(response.status).toBe(400)
    expect(mockEntityValidation).not.toHaveBeenCalled()
  })

  test('rejects a claim with an unknown target type', async () => {
    const response = await post({ ...validClaim, claim_type: 'franchise' })

    expect(response.status).toBe(400)
    expect(mockEntityValidation).not.toHaveBeenCalled()
  })

  test('rejects a malformed target_id with 400 before touching the database', async () => {
    const response = await post({ ...validClaim, target_id: 'not-a-uuid' })

    expect(response.status).toBe(400)
    expect(mockEntityValidation).not.toHaveBeenCalled()
  })

  test('rejects a claim for an entity that does not exist', async () => {
    mockEntityValidation.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116', message: 'No rows found' } })

    const response = await post(validClaim)

    expect(response.status).toBe(404)
    expect(mockInsertResult).not.toHaveBeenCalled()
  })

  test('surfaces a real validation error as 500, not a 404', async () => {
    mockEntityValidation.mockResolvedValueOnce({ data: null, error: { code: '57014', message: 'query timeout' } })

    const response = await post(validClaim)

    expect(response.status).toBe(500)
    expect(mockInsertResult).not.toHaveBeenCalled()
  })

  test('persists a shop claim against shop_id', async () => {
    mockEntityValidation.mockResolvedValueOnce({ data: { uuid: SHOP_ID }, error: null })
    mockInsertResult.mockResolvedValueOnce({ data: null, error: null })

    const response = await post(validClaim)

    expect(response.status).toBe(201)
    expect(mockInsertResult).toHaveBeenCalledWith([
      expect.objectContaining({ shop_id: SHOP_ID, status: 'pending' }),
    ])
  })

  test('resolves a company-owned shop claim up to company_id', async () => {
    // A shop with a company_id is owned by that company, so the claim must persist
    // against company_id even when the request says claim_type: 'shop'.
    mockEntityValidation.mockResolvedValueOnce({ data: { uuid: SHOP_ID, company_id: COMPANY_ID }, error: null })
    mockInsertResult.mockResolvedValueOnce({ data: null, error: null })

    const response = await post(validClaim)

    expect(response.status).toBe(201)
    const inserted = mockInsertResult.mock.calls[0][0][0]
    expect(inserted.company_id).toBe(COMPANY_ID)
    expect(inserted.shop_id).toBeUndefined()
  })

  test('persists a company claim against company_id, not shop_id', async () => {
    mockEntityValidation.mockResolvedValueOnce({ data: { id: COMPANY_ID }, error: null })
    mockInsertResult.mockResolvedValueOnce({ data: null, error: null })

    const response = await post({ ...validClaim, claim_type: 'company', target_id: COMPANY_ID })

    expect(response.status).toBe(201)
    const inserted = mockInsertResult.mock.calls[0][0][0]
    expect(inserted.company_id).toBe(COMPANY_ID)
    expect(inserted.shop_id).toBeUndefined()
  })

  test('persists a roaster claim against roaster_id', async () => {
    const ROASTER_ID = '33333333-3333-3333-3333-333333333333'
    mockEntityValidation.mockResolvedValueOnce({ data: { id: ROASTER_ID }, error: null })
    mockInsertResult.mockResolvedValueOnce({ data: null, error: null })

    const response = await post({ ...validClaim, claim_type: 'roaster', target_id: ROASTER_ID })

    expect(response.status).toBe(201)
    const inserted = mockInsertResult.mock.calls[0][0][0]
    expect(inserted.roaster_id).toBe(ROASTER_ID)
    expect(inserted.shop_id).toBeUndefined()
  })

  test('returns 500 when the claim insert fails', async () => {
    mockEntityValidation.mockResolvedValueOnce({ data: { uuid: SHOP_ID }, error: null })
    mockInsertResult.mockResolvedValueOnce({ data: null, error: { message: 'insert failed' } })

    const response = await post(validClaim)

    expect(response.status).toBe(500)
  })
})
