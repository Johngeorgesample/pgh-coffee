import { describe, test, expect, vi, beforeEach } from 'vitest'
import { act } from '@testing-library/react'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('exploreStore', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  describe('fetchFeaturedShop', () => {
    test('fetches and caches featured shop data', async () => {
      const mockShop = { properties: { name: 'Test Shop' } }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockShop),
      })

      const { default: useExploreStore } = await import('@/stores/exploreStore')

      await act(async () => {
        await useExploreStore.getState().fetchFeaturedShop()
      })

      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith('/api/featured-shop', { cache: 'no-store' })
      expect(useExploreStore.getState().featuredShop).toEqual(mockShop)
      expect(useExploreStore.getState().featuredShopLoading).toBe(false)
      expect(useExploreStore.getState().featuredShopError).toBe(null)

      // Second call should use cache
      await act(async () => {
        await useExploreStore.getState().fetchFeaturedShop()
      })

      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    test('sets error state on fetch failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      const { default: useExploreStore } = await import('@/stores/exploreStore')

      await act(async () => {
        await useExploreStore.getState().fetchFeaturedShop()
      })

      expect(useExploreStore.getState().featuredShop).toBe(null)
      expect(useExploreStore.getState().featuredShopLoading).toBe(false)
      expect(useExploreStore.getState().featuredShopError).toBe('HTTP 500')

      // Should not retry after error
      await act(async () => {
        await useExploreStore.getState().fetchFeaturedShop()
      })

      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    test('sets error state on network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const { default: useExploreStore } = await import('@/stores/exploreStore')

      await act(async () => {
        await useExploreStore.getState().fetchFeaturedShop()
      })

      expect(useExploreStore.getState().featuredShopError).toBe('Network error')
      expect(useExploreStore.getState().featuredShopLoading).toBe(false)
    })
  })

  describe('fetchEvents', () => {
    test('fetches and caches events data', async () => {
      const mockEvents = [{ id: '1', title: 'Event 1' }]
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockEvents),
      })

      const { default: useExploreStore } = await import('@/stores/exploreStore')

      await act(async () => {
        await useExploreStore.getState().fetchEvents()
      })

      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith('/api/events', { cache: 'no-store' })
      expect(useExploreStore.getState().events).toEqual(mockEvents)
      expect(useExploreStore.getState().eventsLoading).toBe(false)
      expect(useExploreStore.getState().eventsError).toBe(null)

      // Second call should use cache
      await act(async () => {
        await useExploreStore.getState().fetchEvents()
      })

      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    test('sets error state on fetch failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      const { default: useExploreStore } = await import('@/stores/exploreStore')

      await act(async () => {
        await useExploreStore.getState().fetchEvents()
      })

      expect(useExploreStore.getState().events).toBe(null)
      expect(useExploreStore.getState().eventsLoading).toBe(false)
      expect(useExploreStore.getState().eventsError).toBe('HTTP 404')
    })
  })

  describe('fetchNews', () => {
    test('fetches and caches news data', async () => {
      const mockNews = [{ id: '1', title: 'News 1' }]
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockNews),
      })

      const { default: useExploreStore } = await import('@/stores/exploreStore')

      await act(async () => {
        await useExploreStore.getState().fetchNews()
      })

      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith('/api/updates', { cache: 'no-store' })
      expect(useExploreStore.getState().news).toEqual(mockNews)
      expect(useExploreStore.getState().newsLoading).toBe(false)
      expect(useExploreStore.getState().newsError).toBe(null)

      // Second call should use cache
      await act(async () => {
        await useExploreStore.getState().fetchNews()
      })

      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    test('sets error state on fetch failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      const { default: useExploreStore } = await import('@/stores/exploreStore')

      await act(async () => {
        await useExploreStore.getState().fetchNews()
      })

      expect(useExploreStore.getState().news).toBe(null)
      expect(useExploreStore.getState().newsLoading).toBe(false)
      expect(useExploreStore.getState().newsError).toBe('HTTP 500')
    })

    test('handles null response data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(null),
      })

      const { default: useExploreStore } = await import('@/stores/exploreStore')

      await act(async () => {
        await useExploreStore.getState().fetchNews()
      })

      expect(useExploreStore.getState().news).toEqual([])
    })
  })
})
