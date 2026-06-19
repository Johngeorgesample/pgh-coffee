import { describe, test, expect, vi, beforeEach } from 'vitest'
import { act } from '@testing-library/react'
import useCoffeeShopsStore from '@/stores/coffeeShopsStore'

const mockFetch = vi.fn()
global.fetch = mockFetch

const validFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Test Shop', uuid: 'shop-1' },
      geometry: { type: 'Point', coordinates: [-79.925, 40.4363] },
    },
  ],
}

describe('coffeeShopsStore - fetchCoffeeShops', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useCoffeeShopsStore.setState({
      allShops: { type: 'FeatureCollection', features: [] },
      loadError: false,
    })
  })

  test('sets loadError on a non-ok response and leaves shops empty', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })

    await act(async () => {
      await useCoffeeShopsStore.getState().fetchCoffeeShops()
    })

    expect(useCoffeeShopsStore.getState().loadError).toBe(true)
    expect(useCoffeeShopsStore.getState().allShops.features).toHaveLength(0)
  })

  test('loads shops and clears loadError on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => validFeatureCollection,
    })

    await act(async () => {
      await useCoffeeShopsStore.getState().fetchCoffeeShops()
    })

    expect(useCoffeeShopsStore.getState().loadError).toBe(false)
    expect(useCoffeeShopsStore.getState().allShops.features).toHaveLength(1)
  })
})
