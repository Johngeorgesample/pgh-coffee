import { describe, test, expect, vi, beforeEach, beforeAll } from 'vitest'
import { safeNextPath } from '@/app/auth/callback/safeNextPath'

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

// `origin` has no trailing slash, so these `next` values would otherwise be
// concatenated into a URL whose host is no longer ours — an attacker-chosen
// landing page reached straight after a real Google sign-in.
describe('safeNextPath', () => {
  test.each([
    ['@evil.com', 'userinfo separator makes evil.com the host'],
    ['.evil.com', 'suffixes our host into pgh.coffee.evil.com'],
    ['//evil.com', 'protocol-relative'],
    ['https://evil.com', 'absolute URL'],
    [' //evil.com', 'leading space'],
  ])('rejects %j (%s)', (next) => {
    expect(safeNextPath(next)).toBe('/')
    expect(new URL(`https://pgh.coffee${safeNextPath(next)}`).host).toBe('pgh.coffee')
  })

  test('keeps a rooted internal path', () => {
    expect(safeNextPath('/account/favorites')).toBe('/account/favorites')
  })

  test('falls back to the root when absent', () => {
    expect(safeNextPath(null)).toBe('/')
  })
})

describe('Auth Callback API Route - open redirect', () => {
  test('redirects to the site root instead of an off-site next', async () => {
    mockExchangeCodeForSession.mockResolvedValueOnce({ error: null })

    const request = new Request('http://localhost:3000/auth/callback?code=abc123&next=@evil.com')
    const response = await (await import('@/app/auth/callback/route')).GET(request)

    expect(new URL(response.headers.get('location')!).host).toBe('localhost:3000')
  })
})
