import { describe, test, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useShopSelection } from '@/hooks/useShopSelection'
import type { TShop } from '@/types/shop-types'

// Mock external dependencies
const mockPush = vi.fn()
const mockPlausible = vi.fn()
const mockSetCurrentShop = vi.fn()
const mockSetSearchValue = vi.fn()
const mockSetPanelContent = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('next-plausible', () => ({
  usePlausible: () => mockPlausible,
}))

const mockSetDisplayedShops = vi.fn()
const mockAllShops: TShop[] = []

vi.mock('@/stores/coffeeShopsStore', () => ({
  __esModule: true,
  default: () => ({
    setCurrentShop: mockSetCurrentShop,
    setDisplayedShops: mockSetDisplayedShops,
    allShops: mockAllShops
  }),
}))

vi.mock('@/stores/panelStore', () => ({
  __esModule: true,
  default: () => ({ 
    setSearchValue: mockSetSearchValue, 
    setPanelContent: mockSetPanelContent 
  }),
}))

// Mock ShopDetails component
vi.mock('@/app/components/ShopDetails', () => ({
  __esModule: true,
  default: ({ shop }: { shop: TShop }) => `<ShopDetails shop="${shop.properties.name}" />`,
}))

// Mock window.location
const mockLocation = {
  href: 'https://example.com',
}
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
})

// Mock scrollTo and querySelectorAll for desktop scrolling
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
})

const mockElement = {
  scrollTop: 100,
  scrollTo: vi.fn(),
}

Object.defineProperty(document, 'querySelectorAll', {
  value: vi.fn(() => [mockElement]),
  writable: true,
})

describe('useShopSelection', () => {
  const mockShop: TShop = {
    type: 'shop',
    properties: {
      company: null,
      name: 'Test Coffee Shop',
      neighborhood: 'Downtown',
      address: '123 Main St, Pittsburgh, PA 15213',
      photo: 'test-photo.jpg',
      website: 'https://testcoffee.com',
      uuid: '12345'
    },
    geometry: {
      type: 'Point',
      coordinates: [-79.925, 40.4363],
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockSetDisplayedShops.mockClear()
    // Reset matchMedia mock to default
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn(() => ({
        matches: false,
        media: '',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  test('returns handleShopSelect function', () => {
    const { result } = renderHook(() => useShopSelection())
    
    expect(result.current).toHaveProperty('handleShopSelect')
    expect(typeof result.current.handleShopSelect).toBe('function')
  })

  test('handleShopSelect sets panel content with ShopDetails', () => {
    const { result } = renderHook(() => useShopSelection())
    
    act(() => {
      result.current.handleShopSelect(mockShop)
    })

    expect(mockSetPanelContent).toHaveBeenCalledWith(
      expect.anything(), // The JSX element
      'shop'
    )
  })
})
