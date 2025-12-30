import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import { mockAnimationsApi } from 'jsdom-testing-mocks'
import HomeClient from '@/app/components/HomeClient'
import useShopsStore from '@/stores/coffeeShopsStore'
import { DISTANCE_UNITS } from '@/app/settings/DistanceUnitsDialog'

beforeAll(() => {
  mockAnimationsApi()
  globalThis.matchMedia =
    globalThis.matchMedia ||
    function () {
      return {
        matches: false,
        addEventListener: () => {},
        removeEventListener: () => {},
      }
    }
})

vi.mock('react-map-gl', () => {
  return {
    default: ({ children }: any) => <div>{children}</div>,
    Source: ({ children }: any) => <div>{children}</div>,
    Layer: ({ children }: any) => <div>{children}</div>,
  }
})

vi.mock('next/navigation', () => ({
  useRouter: vi.fn().mockReturnValue({
    replace: vi.fn(),
    push: vi.fn(),
  }),
}))

vi.mock('next-plausible', () => ({
  usePlausible: () => vi.fn(),
}))

vi.mock('@/stores/coffeeShopsStore')

const mockShops = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Test Coffee Shop',
        neighborhood: 'Test Area',
        address: '123 Test St',
        selected: false,
      },
      geometry: {
        type: 'Point',
        coordinates: [-122.123, 47.123],
      },
    },
  ],
}

describe.skip('HomeClient', () => {
  beforeEach(() => {
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn(),
    }
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    })

    window.history.pushState = vi.fn()
    window.history.replaceState = vi.fn()

    window.HTMLElement.prototype.scrollIntoView = vi.fn()

    vi.mocked(useShopsStore).mockReturnValue({
      coffeeShops: mockShops,
      fetchCoffeeShops: vi.fn(),
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch coffee shops on mount', () => {
    render(<HomeClient />)
    expect(useShopsStore().fetchCoffeeShops).toHaveBeenCalled()
  })

  it('should set default distance units if not set', () => {
    render(<HomeClient />)
    expect(window.localStorage.getItem).toHaveBeenCalledWith('distanceUnits')
    expect(window.localStorage.setItem).toHaveBeenCalledWith('distanceUnits', DISTANCE_UNITS.Miles)
  })

  it.skip('should fetch shop details when URL contains shop parameter', () => {})

  it.skip('should update current shop marker when shop is selected', () => {})
})
