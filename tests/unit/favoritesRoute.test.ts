import { describe, test, expect, vi, beforeEach, beforeAll } from 'vitest'

// Create mock functions for the Supabase chain
const mockGetUser = vi.fn()

// Mock results for different query chains
const mockShopValidationResult = vi.fn()
const mockInsertResult = vi.fn()
const mockSelectFavoritesResult = vi.fn()
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
      if (table === 'user_favorites') {
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
              order: mockSelectFavoritesResult,
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

describe('Favorites API Route - POST (Add Favorite)', () => {
  let POST: typeof import('@/app/api/favorites/route').POST

  beforeAll(async () => {
    const module = await import('@/app/api/favorites/route')
    POST = module.POST
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('successfully adds a shop to favorites', async () => {
    const mockUser = { id: 'user-123' }
    const mockFavorite = {
      id: 'fav-123',
      user_id: 'user-123',
      shop_id: 'shop-uuid-456',
      created_at: '2024-01-01T00:00:00Z',
    }

    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } })
    // Mock shop validation
    mockShopValidationResult.mockResolvedValueOnce({ data: { id: 'shop-uuid-456' }, error: null })
    // Mock insert
    mockInsertResult.mockResolvedValueOnce({ data: mockFavorite, error: null })

    const request = new Request('http://localhost:3000/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shopUUID: 'shop-uuid-456' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data).toEqual(mockFavorite)
  })

  test('returns 401 when user is not authenticated', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } })

    const request = new Request('http://localhost:3000/api/favorites', {
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

    const request = new Request('http://localhost:3000/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('shopUUID is required')
  })

  test('returns 500 on database error', async () => {
    const mockUser = { id: 'user-123' }
    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } })
    // Mock shop validation success
    mockShopValidationResult.mockResolvedValueOnce({ data: { id: 'shop-uuid-456' }, error: null })
    // Mock insert failure
    mockInsertResult.mockResolvedValueOnce({
      data: null,
      error: { message: 'Database error' },
    })

    const request = new Request('http://localhost:3000/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shopUUID: 'shop-uuid-456' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error adding favorite')
  })
})

describe('Favorites API Route - GET (Fetch Favorites)', () => {
  let GET: typeof import('@/app/api/favorites/route').GET

  beforeAll(async () => {
    const module = await import('@/app/api/favorites/route')
    GET = module.GET
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('successfully fetches favorites for authenticated user', async () => {
    const mockUser = { id: 'user-123' }
    const mockFavorites = [
      { id: 'fav-1', created_at: '2024-01-01T00:00:00Z', shop: { name: 'Coffee Shop 1' } },
      { id: 'fav-2', created_at: '2024-01-02T00:00:00Z', shop: { name: 'Coffee Shop 2' } },
    ]

    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } })
    mockSelectFavoritesResult.mockResolvedValueOnce({ data: mockFavorites, error: null })

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual(mockFavorites)
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
    mockSelectFavoritesResult.mockResolvedValueOnce({
      data: null,
      error: { message: 'Database error' },
    })

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error fetching favorites')
  })
})

describe('Favorites API Route - DELETE (Remove Favorite)', () => {
  let DELETE: typeof import('@/app/api/favorites/route').DELETE

  beforeAll(async () => {
    const module = await import('@/app/api/favorites/route')
    DELETE = module.DELETE
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('successfully removes a shop from favorites', async () => {
    const mockUser = { id: 'user-123' }

    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } })
    mockDeleteResult.mockResolvedValueOnce({ error: null })

    const request = new Request('http://localhost:3000/api/favorites', {
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

    const request = new Request('http://localhost:3000/api/favorites', {
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

    const request = new Request('http://localhost:3000/api/favorites', {
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
    mockDeleteResult.mockResolvedValueOnce({
      error: { message: 'Database error' },
    })

    const request = new Request('http://localhost:3000/api/favorites', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shopUUID: 'shop-uuid-456' }),
    })

    const response = await DELETE(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error removing favorite')
  })
})
