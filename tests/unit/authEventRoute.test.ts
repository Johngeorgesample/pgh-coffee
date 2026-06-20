import { describe, test, expect, vi, beforeEach, beforeAll } from 'vitest'

const mockGetUser = vi.fn()
const mockLoggerInfo = vi.fn()
const mockAuthSignIn = vi.fn()
const mockAuthSignUp = vi.fn()
const mockAuthSignOut = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve({
    auth: {
      getUser: mockGetUser,
    },
  })),
}))

vi.mock('@/lib/logger', () => ({
  logger: {
    info: mockLoggerInfo,
  },
}))

vi.mock('@/lib/metrics', () => ({
  metrics: {
    authSignIn: mockAuthSignIn,
    authSignUp: mockAuthSignUp,
    authSignOut: mockAuthSignOut,
  },
}))

const mockUser = { id: 'user-1', email: 'test@example.com' }

describe('Auth Event API Route - POST', () => {
  let POST: typeof import('@/app/api/auth/event/route').POST

  beforeAll(async () => {
    const module = await import('@/app/api/auth/event/route')
    POST = module.POST
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('returns 401 when there is no authenticated user', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } })

    const request = new Request('http://localhost:3000/api/auth/event', {
      method: 'POST',
      body: JSON.stringify({ event: 'User signed in' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
    expect(mockAuthSignIn).not.toHaveBeenCalled()
  })

  test('records a sign-in event and increments the sign-in metric', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } })

    const request = new Request('http://localhost:3000/api/auth/event', {
      method: 'POST',
      body: JSON.stringify({ event: 'User signed in' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({ ok: true })
    expect(mockAuthSignIn).toHaveBeenCalledOnce()
    expect(mockAuthSignUp).not.toHaveBeenCalled()
    expect(mockAuthSignOut).not.toHaveBeenCalled()
    expect(mockLoggerInfo).toHaveBeenCalledWith('User signed in', { userID: 'user-1', email: 'test@example.com' })
  })

  test('records a sign-up event and increments the sign-up metric', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } })

    const request = new Request('http://localhost:3000/api/auth/event', {
      method: 'POST',
      body: JSON.stringify({ event: 'User signed up' }),
    })

    const response = await POST(request)

    expect(response.status).toBe(200)
    expect(mockAuthSignUp).toHaveBeenCalledOnce()
    expect(mockAuthSignIn).not.toHaveBeenCalled()
  })

  test('records a sign-out event and increments the sign-out metric', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } })

    const request = new Request('http://localhost:3000/api/auth/event', {
      method: 'POST',
      body: JSON.stringify({ event: 'User signed out' }),
    })

    const response = await POST(request)

    expect(response.status).toBe(200)
    expect(mockAuthSignOut).toHaveBeenCalledOnce()
  })

  test('logs unrecognized events without incrementing any metric', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } })

    const request = new Request('http://localhost:3000/api/auth/event', {
      method: 'POST',
      body: JSON.stringify({ event: 'Something else' }),
    })

    const response = await POST(request)

    expect(response.status).toBe(200)
    expect(mockAuthSignIn).not.toHaveBeenCalled()
    expect(mockAuthSignUp).not.toHaveBeenCalled()
    expect(mockAuthSignOut).not.toHaveBeenCalled()
    expect(mockLoggerInfo).toHaveBeenCalledWith('Something else', { userID: 'user-1', email: 'test@example.com' })
  })

  test('falls back to an empty email when the user has none', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: { id: 'user-2', email: undefined } } })

    const request = new Request('http://localhost:3000/api/auth/event', {
      method: 'POST',
      body: JSON.stringify({ event: 'User signed in' }),
    })

    await POST(request)

    expect(mockLoggerInfo).toHaveBeenCalledWith('User signed in', { userID: 'user-2', email: '' })
  })
})
