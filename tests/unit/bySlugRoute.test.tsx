import { describe, test, expect, vi, beforeEach, beforeAll } from 'vitest'
import { NextRequest } from 'next/server'

const mockSelect = vi.fn()

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      select: mockSelect,
    }),
  }),
}))

describe('Shop by-slug API Route', () => {
  let GET: typeof import('@/app/api/shops/by-slug/[slug]/route').GET

  beforeAll(async () => {
    const module = await import('@/app/api/shops/by-slug/[slug]/route')
    GET = module.GET
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockShops = [
    {
      name: 'Trace Echo + Ghost Coffee',
      neighborhood: 'Lawrenceville',
      address: '123 Main St',
      photo: 'photo.jpg',
      website: 'https://example.com',
      uuid: '12345678-aaaa-bbbb-cccc-111111111111',
      latitude: 40.4363,
      longitude: -79.925,
      company: null,
    },
    {
      name: 'Test Coffee Shop',
      neighborhood: 'Downtown',
      address: '456 Other St',
      photo: 'other.jpg',
      website: 'https://other.com',
      uuid: 'aaaaaaaa-1111-2222-3333-444444444444',
      latitude: 40.44,
      longitude: -79.93,
      company: null,
    },
  ]

  test('resolves a shop matching the uuid prefix in the slug', async () => {
    mockSelect.mockResolvedValueOnce({ data: mockShops, error: null })

    const slug = 'trace-echo-ghost-coffee-lawrenceville-12345678'
    const request = new NextRequest(`http://localhost:3000/api/shops/by-slug/${slug}`)
    const params = Promise.resolve({ slug })

    const response = await GET(request, { params })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.properties.name).toBe('Trace Echo + Ghost Coffee')
    expect(data.properties.neighborhood).toBe('Lawrenceville')
  })

  test('returns 404 without querying the database when the slug has no uuid suffix', async () => {
    const slug = 'not-a-real-slug'
    const request = new NextRequest(`http://localhost:3000/api/shops/by-slug/${slug}`)
    const params = Promise.resolve({ slug })

    const response = await GET(request, { params })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.message).toBe('Shop not found')
    expect(mockSelect).not.toHaveBeenCalled()
  })

  test('returns 404 when no shop matches the uuid prefix', async () => {
    mockSelect.mockResolvedValueOnce({ data: mockShops, error: null })

    const slug = 'some-slug-deadbeef'
    const request = new NextRequest(`http://localhost:3000/api/shops/by-slug/${slug}`)
    const params = Promise.resolve({ slug })

    const response = await GET(request, { params })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.message).toBe('Shop not found')
  })

  test('returns 404 on database error', async () => {
    mockSelect.mockResolvedValueOnce({ data: null, error: { message: 'Database error' } })

    const slug = 'some-slug-12345678'
    const request = new NextRequest(`http://localhost:3000/api/shops/by-slug/${slug}`)
    const params = Promise.resolve({ slug })

    const response = await GET(request, { params })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.message).toBe('Shop not found')
  })
})
