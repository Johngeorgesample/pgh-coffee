import { describe, test, expect, vi, beforeEach, beforeAll } from 'vitest'

// Create mock functions for the Supabase chain
const mockGetUser = vi.fn()

// Mock results for different query chains
const mockShopValidationResult = vi.fn()
const mockInsertResult = vi.fn()
const mockSelectVisitsResult = vi.fn()
const mockDeleteResult = vi.fn()

// Mock the server Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve({
    auth: {
      getUser: mockGetUser,
    },
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
      if (table === 'user_visits') {
        return {
          // Chain: insert().select().single()
          insert: () => ({
            select: () => ({
              single: mockInsertResult,
            }),
          }),
          // Chain: select().eq().order()
          select: () => ({
            eq: () => ({
              order: mockSelectVisitsResult,
            }),
          }),
          // Chain: delete().eq().eq()
          delete: () => ({
            eq: () => ({
              eq: mockDeleteResult,
            }),
          }),
        }
      }
      return {}
    },
  })),
}))

describe('Visits API Route - POST (Add Visit)', () => {
  let POST: typeof import('@/app/api/visits/route').POST

  beforeAll(async () => {
    const module = await import('@/app/api/visits/route')
    POST = module.POST
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('successfully marks a shop as visited', async () => {
    const mockUser = { id: 'user-123' }
    const mockVisit = {
      id: 'visit-123',
      user_id: 'user-123',
      shop_id: 'shop-uuid-456',
      created_at: '2024-01-01T00:00:00Z',
    }

    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } })
    mockShopValidationResult.mockResolvedValueOnce({ data: { uuid: 'shop-uuid-456', name: 'Shop', neighborhood: 'Bloomfield' }, error: null })
    mockInsertResult.mockResolvedValueOnce({ data: mockVisit, error: null })

    const request = new Request('http://localhost:3000/api/visits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shopUUID: 'shop-uuid-456' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data).toEqual(mockVisit)
  })

  test('returns 401 when user is not authenticated', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } })

    const request = new Request('http://localhost:3000/api/visits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shopUUID: 'shop-uuid-456' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  test('returns 400 when shopUUID is missing', async () => {
    const mockUser = { id: 'user-123' }
    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } })

    const request = new Request('http://localhost:3000/api/visits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('shopUUID is required')
  })

  test('returns 404 when the shop does not exist', async () => {
    const mockUser = { id: 'user-123' }
    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } })
    mockShopValidationResult.mockResolvedValueOnce({ data: null, error: { message: 'No rows' } })

    const request = new Request('http://localhost:3000/api/visits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shopUUID: 'does-not-exist' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Shop not found')
  })

  test('returns 500 on database error', async () => {
    const mockUser = { id: 'user-123' }
    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } })
    mockShopValidationResult.mockResolvedValueOnce({ data: { uuid: 'shop-uuid-456', name: 'Shop', neighborhood: 'Bloomfield' }, error: null })
    mockInsertResult.mockResolvedValueOnce({ data: null, error: { message: 'Database error' } })

    const request = new Request('http://localhost:3000/api/visits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shopUUID: 'shop-uuid-456' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error adding visit')
  })
})

describe('Visits API Route - GET (Fetch Visits)', () => {
  let GET: typeof import('@/app/api/visits/route').GET

  beforeAll(async () => {
    const module = await import('@/app/api/visits/route')
    GET = module.GET
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('successfully fetches visits for authenticated user', async () => {
    const mockUser = { id: 'user-123' }
    const mockVisits = [
      { id: 'visit-1', created_at: '2024-01-01T00:00:00Z', shop: { name: 'Coffee Shop 1' } },
      { id: 'visit-2', created_at: '2024-01-02T00:00:00Z', shop: { name: 'Coffee Shop 2' } },
    ]

    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } })
    mockSelectVisitsResult.mockResolvedValueOnce({ data: mockVisits, error: null })

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual(mockVisits)
  })

  test('returns 401 when user is not authenticated', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } })

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  test('returns 500 on database error', async () => {
    const mockUser = { id: 'user-123' }
    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } })
    mockSelectVisitsResult.mockResolvedValueOnce({ data: null, error: { message: 'Database error' } })

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error fetching visits')
  })
})

describe('Visits API Route - DELETE (Remove Visit)', () => {
  let DELETE: typeof import('@/app/api/visits/route').DELETE

  beforeAll(async () => {
    const module = await import('@/app/api/visits/route')
    DELETE = module.DELETE
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('successfully removes a visit', async () => {
    const mockUser = { id: 'user-123' }

    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } })
    mockDeleteResult.mockResolvedValueOnce({ error: null })

    const request = new Request('http://localhost:3000/api/visits', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shopUUID: 'shop-uuid-456' }),
    })

    const response = await DELETE(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
  })

  test('returns 401 when user is not authenticated', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } })

    const request = new Request('http://localhost:3000/api/visits', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shopUUID: 'shop-uuid-456' }),
    })

    const response = await DELETE(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  test('returns 400 when shopUUID is missing', async () => {
    const mockUser = { id: 'user-123' }
    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } })

    const request = new Request('http://localhost:3000/api/visits', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    const response = await DELETE(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('shopUUID is required')
  })

  test('returns 500 on database error', async () => {
    const mockUser = { id: 'user-123' }
    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } })
    mockDeleteResult.mockResolvedValueOnce({ error: { message: 'Database error' } })

    const request = new Request('http://localhost:3000/api/visits', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shopUUID: 'shop-uuid-456' }),
    })

    const response = await DELETE(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error removing visit')
  })
})
