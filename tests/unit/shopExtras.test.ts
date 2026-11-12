import { describe, test, expect, vi, afterEach } from 'vitest'
import { prefetchShopExtras, fetchShopExtra, shopHoursUrl } from '@/app/utils/shopExtras'

describe('shop extras prefetch', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  test('the panel reuses a hover prefetch instead of fetching again', async () => {
    const fetchMock = vi.fn(() => Promise.resolve(new Response('[]')))
    vi.stubGlobal('fetch', fetchMock)

    prefetchShopExtras('shop-a')
    await fetchShopExtra(shopHoursUrl('shop-a'))

    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  test('a prefetch older than 30s is ignored so the panel never shows stale data', async () => {
    vi.useFakeTimers()
    const fetchMock = vi.fn(() => Promise.resolve(new Response('[]')))
    vi.stubGlobal('fetch', fetchMock)

    prefetchShopExtras('shop-b')
    vi.advanceTimersByTime(31_000)
    await fetchShopExtra(shopHoursUrl('shop-b'))

    expect(fetchMock).toHaveBeenCalledTimes(4)
  })
})
