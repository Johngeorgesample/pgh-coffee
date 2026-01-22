import { describe, test, expect, vi, beforeEach, beforeAll } from 'vitest'
import { NextRequest } from 'next/server'

// Create mock functions for the Supabase chain
const mockData = vi.fn()

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: mockData,
        }),
      }),
    }),
  }),
}))

describe('Shop Details API Route', () => {
  let GET: typeof import('@/app/api/shops/[shopDetails]/route').GET

  beforeAll(async () => {
    const module = await import('@/app/api/shops/[shopDetails]/route')
    GET = module.GET
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('handles shop names with + character correctly', async () => {
    const mockShopData = [{
      name: 'Trace Echo + Ghost Coffee',
      neighborhood: 'Lawrenceville',
      address: '123 Main St',
      photo: 'photo.jpg',
      website: 'https://example.com',
      uuid: '123',
      latitude: 40.4363,
      longitude: -79.925,
      company: null,
    }]

    mockData.mockResolvedValueOnce({
      data: mockShopData,
      error: null,
    })

    const request = new NextRequest('http://localhost:3000/api/shops/test')
    const params = Promise.resolve({ 
      shopDetails: 'Trace Echo + Ghost Coffee_Lawrenceville' 
    })

    const response = await GET(request, { params })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.properties.name).toBe('Trace Echo + Ghost Coffee')
    expect(data.properties.neighborhood).toBe('Lawrenceville')
  })

  test('handles shop names with spaces correctly', async () => {
    const mockShopData = [{
      name: 'Test Coffee Shop',
      neighborhood: 'Downtown',
      address: '123 Main St',
      photo: 'photo.jpg',
      website: 'https://example.com',
      uuid: '456',
      latitude: 40.4363,
      longitude: -79.925,
      company: null,
    }]

    mockData.mockResolvedValueOnce({
      data: mockShopData,
      error: null,
    })

    const request = new NextRequest('http://localhost:3000/api/shops/test')
    const params = Promise.resolve({ 
      shopDetails: 'Test Coffee Shop_Downtown' 
    })

    const response = await GET(request, { params })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.properties.name).toBe('Test Coffee Shop')
  })

  test('returns 404 when shop not found', async () => {
    mockData.mockResolvedValueOnce({
      data: [],
      error: null,
    })

    const request = new NextRequest('http://localhost:3000/api/shops/test')
    const params = Promise.resolve({ 
      shopDetails: 'Nonexistent Shop_Downtown' 
    })

    const response = await GET(request, { params })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.message).toBe('Shop not found')
  })

  test('returns 500 on database error', async () => {
    mockData.mockResolvedValueOnce({
      data: null,
      error: { message: 'Database error' },
    })

    const request = new NextRequest('http://localhost:3000/api/shops/test')
    const params = Promise.resolve({ 
      shopDetails: 'Some Shop_Downtown' 
    })

    const response = await GET(request, { params })
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error fetching shop')
  })
})

