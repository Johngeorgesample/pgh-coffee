import { describe, test, expect, vi, beforeEach, beforeAll } from 'vitest'

const mockExchangeCodeForSession = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve({
    auth: {
      exchangeCodeForSession: mockExchangeCodeForSession,
    },
  })),
}))

describe('Auth Callback API Route - GET', () => {
  let GET: typeof import('@/app/auth/callback/route').GET

  beforeAll(async () => {
    const module = await import('@/app/auth/callback/route')
    GET = module.GET
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('redirects to the default path on successful code exchange', async () => {
    mockExchangeCodeForSession.mockResolvedValueOnce({ error: null })

    const request = new Request('http://localhost:3000/auth/callback?code=abc123')
    const response = await GET(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('http://localhost:3000/')
    expect(mockExchangeCodeForSession).toHaveBeenCalledWith('abc123')
  })

  test('redirects to the requested next path on successful code exchange', async () => {
    mockExchangeCodeForSession.mockResolvedValueOnce({ error: null })

    const request = new Request('http://localhost:3000/auth/callback?code=abc123&next=/account')
    const response = await GET(request)

    expect(response.headers.get('location')).toBe('http://localhost:3000/account')
  })

  test('redirects to sign-in with an error when the code exchange fails', async () => {
    mockExchangeCodeForSession.mockResolvedValueOnce({ error: { message: 'Invalid code' } })

    const request = new Request('http://localhost:3000/auth/callback?code=bad-code')
    const response = await GET(request)

    expect(response.headers.get('location')).toBe('http://localhost:3000/sign-in?error=auth_failed')
  })

  test('redirects to sign-in with an error when no code is provided', async () => {
    const request = new Request('http://localhost:3000/auth/callback')
    const response = await GET(request)

    expect(response.headers.get('location')).toBe('http://localhost:3000/sign-in?error=auth_failed')
    expect(mockExchangeCodeForSession).not.toHaveBeenCalled()
  })
})
