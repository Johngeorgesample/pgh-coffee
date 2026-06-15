import { render, screen, fireEvent } from '@testing-library/react'
import { describe, vi } from 'vitest'
import PanelContent from '@/app/components/PanelContent'
import { getGoogleMapsUrl } from '@/app/components/DirectionsButton'
import type { TShop, RoasterRef } from '@/types/shop-types'

const mockSetPanelContent = vi.fn()
vi.mock('@/stores/panelStore', () => ({
  default: () => ({ setPanelContent: mockSetPanelContent }),
}))

const mockPlausible = vi.fn()
vi.mock('@/hooks', async importOriginal => ({
  ...(await importOriginal<typeof import('@/hooks')>()),
  useAnalytics: () => mockPlausible,
}))

// Mock next-plausible
vi.mock('next-plausible', () => ({
  usePlausible: () => vi.fn(),
}))

// Mock AuthProvider
vi.mock('@/app/components/AuthProvider', () => ({
  useAuth: () => ({ user: null, loading: false }),
}))

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signInWithOAuth: vi.fn(),
    },
  }),
}))

describe('getGoogleMapsUrl', () => {
  it('returns correct Google Maps URL with given coordinates', () => {
    const coordinates = {
      latitude: 40.4363,
      longitude: -79.925,
    }

    const expectedUrl = 'https://www.google.com/maps?q=-79.925,40.4363'
    const result = getGoogleMapsUrl(coordinates)

    expect(result).toBe(expectedUrl)
  })
})

describe('PanelContent', () => {
  const mockShop: TShop = {
    type: 'shop',
    properties: {
      company: null,
      name: 'Test Shop',
      neighborhood: 'Downtown',
      address: '456 Murray Ave, Pittsburgh, PA 15217',
      photo: 'https://example.com/photo.jpg',
      website: 'https://testshop.com',
      uuid: '1234'
    },
    geometry: {
      type: 'Point',
      coordinates: [-79.925, 40.4363],
    },
  }

  const mockHandleNearbyShopClick = vi.fn()

  const defaultProps = {
    shop: mockShop,
    handleNearbyShopClick: mockHandleNearbyShopClick,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders quick action buttons', () => {
    render(<PanelContent {...defaultProps} />)

    expect(screen.getByText('Directions')).toBeTruthy()
    expect(screen.getByText('Website')).toBeTruthy()
  })

  it('renders the shop address', () => {
    const { container } = render(<PanelContent {...defaultProps} />)
    const addressElement = container.querySelector('address')
    expect(addressElement).toBeInTheDocument()
    expect(addressElement).toHaveTextContent(mockShop.properties.address)
  })

  it('renders website link when provided', () => {
    render(<PanelContent {...defaultProps} />)

    const websiteLink = screen.getByText('Website').closest('a')
    expect(websiteLink).toHaveAttribute('href', mockShop.properties.website)
  })

  const withRoaster = (roaster: RoasterRef): TShop => ({
    ...mockShop,
    properties: { ...mockShop.properties, roaster },
  })

  it('opens the roaster panel when a roaster with a slug is clicked', () => {
    const roaster: RoasterRef = { id: 'r1', name: 'Local Roaster', slug: 'local-roaster', is_local: true }
    render(<PanelContent shop={withRoaster(roaster)} />)

    fireEvent.click(screen.getByText('Local Roaster'))
    expect(mockSetPanelContent).toHaveBeenCalledWith(expect.anything(), 'roaster')
    expect(mockPlausible).toHaveBeenCalledWith(
      'RoasterBeansClick',
      expect.objectContaining({ props: expect.objectContaining({ destination: 'roaster_panel' }) }),
    )
  })

  it('links externally for a non-local roaster instead of opening the panel', () => {
    const roaster: RoasterRef = {
      id: 'r2',
      name: 'Far Away Roaster',
      slug: 'far-away',
      is_local: false,
      website: 'https://faraway.example',
    }
    render(<PanelContent shop={withRoaster(roaster)} />)

    const link = screen.getByText('Far Away Roaster').closest('a')
    expect(link).toHaveAttribute('href', 'https://faraway.example')
    expect(mockSetPanelContent).not.toHaveBeenCalled()

    fireEvent.click(link!)
    expect(mockPlausible).toHaveBeenCalledWith(
      'RoasterBeansClick',
      expect.objectContaining({ props: expect.objectContaining({ destination: 'external' }) }),
    )
  })
})
