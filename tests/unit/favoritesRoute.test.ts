import { describe, test, expect, vi, beforeEach } from 'vitest'

// Create mock functions for the Supabase chain
const mockInsert = vi.fn()
const mockSelect = vi.fn()
const mockSingle = vi.fn()
const mockGetUser = vi.fn()

// Mock the server Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve({
    auth: {
      getUser: mockGetUser,
    },
    from: () => ({
      insert: mockInsert,
    }),
  })),
}))

// Import the route handler after mocking
const { POST } = await import('@/app/api/favorites/route')

describe('Favorites API Route - POST (Add Favorite)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Setup default chain behavior
    mockInsert.mockReturnValue({ select: mockSelect })
    mockSelect.mockReturnValue({ single: mockSingle })
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
    mockSingle.mockResolvedValueOnce({ data: mockFavorite, error: null })

    const request = new Request('http://localhost:3000/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shopUUID: 'shop-uuid-456' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data).toEqual(mockFavorite)
    expect(mockInsert).toHaveBeenCalledWith({
      user_id: 'user-123',
      shop_id: 'shop-uuid-456',
    })
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
    expect(mockInsert).not.toHaveBeenCalled()
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
    expect(mockInsert).not.toHaveBeenCalled()
  })

  test('returns 500 on database error', async () => {
    const mockUser = { id: 'user-123' }
    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } })
    mockSingle.mockResolvedValueOnce({
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
