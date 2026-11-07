import { describe, test, expect, beforeAll, vi } from 'vitest'

// The auth gate returns before any capture helper runs; mock the module only so
// the route imports cleanly without touching real Supabase/Anthropic.
vi.mock('@/lib/capture', () => ({
  getImageData: vi.fn(),
  getShopCandidates: vi.fn(),
  buildShopContext: vi.fn(),
  validateShopUUID: vi.fn(),
  callAnthropicVision: vi.fn(),
  getRoasterID: vi.fn(),
  supabase: { from: vi.fn() },
}))

describe('Updates Capture API Route - POST auth gate', () => {
  let POST: typeof import('@/app/api/updates/capture/route').POST

  beforeAll(async () => {
    POST = (await import('@/app/api/updates/capture/route')).POST
  })

  test('returns 401 when x-capture-secret header is missing', async () => {
    const request = new Request('http://localhost/api/updates/capture', { method: 'POST' })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })
})
