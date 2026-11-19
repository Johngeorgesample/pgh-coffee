import { describe, test, expect, vi, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { seedPanel, useSeededFetch } from '@/hooks/useSeededFetch'

describe('useSeededFetch', () => {
  afterEach(() => vi.unstubAllGlobals())

  test('renders seeded data immediately without hitting the API', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    seedPanel('roaster:seeded', { name: 'Seeded' })

    const { result } = renderHook(() => useSeededFetch('roaster:seeded', '/api/roasters/seeded'))

    expect(result.current).toEqual({ data: { name: 'Seeded' }, loading: false })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  test('falls back to the API when nothing was seeded', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ name: 'Fetched' }) }))

    const { result } = renderHook(() => useSeededFetch('roaster:unseeded', '/api/roasters/unseeded'))

    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current).toEqual({ data: { name: 'Fetched' }, loading: false }))
  })

  test('treats a non-OK response as not found', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, json: async () => ({ message: 'Roaster not found' }) }))

    const { result } = renderHook(() => useSeededFetch('roaster:missing', '/api/roasters/missing'))

    await waitFor(() => expect(result.current).toEqual({ data: null, loading: false }))
  })
})
