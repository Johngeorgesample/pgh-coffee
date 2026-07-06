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
    const response = await post({ claim_type: 'shop', target_id: 'shop-1', contact_name: 'Jane' })

    expect(response.status).toBe(400)
    expect(mockEntityValidation).not.toHaveBeenCalled()
  })

  test('rejects a claim with an unknown target type', async () => {
    const response = await post({
      claim_type: 'franchise',
      target_id: 'x',
      contact_name: 'Jane',
      business_email: 'jane@example.com',
    })

    expect(response.status).toBe(400)
    expect(mockEntityValidation).not.toHaveBeenCalled()
  })

  test('rejects a claim for an entity that does not exist', async () => {
    mockEntityValidation.mockResolvedValueOnce({ data: null, error: { message: 'No rows found' } })

    const response = await post({
      claim_type: 'shop',
      target_id: 'missing',
      contact_name: 'Jane',
      business_email: 'jane@example.com',
    })

    expect(response.status).toBe(404)
    expect(mockInsertResult).not.toHaveBeenCalled()
  })

  test('persists a shop claim against shop_id', async () => {
    mockEntityValidation.mockResolvedValueOnce({ data: { uuid: 'shop-1' }, error: null })
    mockInsertResult.mockResolvedValueOnce({ data: [{ id: 'claim-1' }], error: null })

    const response = await post({
      claim_type: 'shop',
      target_id: 'shop-1',
      contact_name: 'Jane',
      business_email: 'jane@example.com',
    })

    expect(response.status).toBe(201)
    expect(mockInsertResult).toHaveBeenCalledWith([
      expect.objectContaining({ shop_id: 'shop-1', status: 'pending' }),
    ])
  })

  test('persists a company claim against company_id, not shop_id', async () => {
    mockEntityValidation.mockResolvedValueOnce({ data: { id: 'company-1' }, error: null })
    mockInsertResult.mockResolvedValueOnce({ data: [{ id: 'claim-2' }], error: null })

    const response = await post({
      claim_type: 'company',
      target_id: 'company-1',
      contact_name: 'Jane',
      business_email: 'jane@example.com',
    })

    expect(response.status).toBe(201)
    const inserted = mockInsertResult.mock.calls[0][0][0]
    expect(inserted.company_id).toBe('company-1')
    expect(inserted.shop_id).toBeUndefined()
  })
})
