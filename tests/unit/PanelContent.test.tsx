import { render, screen } from '@testing-library/react'
import { describe, vi } from 'vitest'
import PanelContent from '@/app/components/PanelContent'
import { getGoogleMapsUrl } from '@/app/components/DirectionsButton'
import type { TShop } from '@/types/shop-types'

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
    expect(screen.getByRole('link', { name: 'Website' })).toBeTruthy()
  })

  it('renders the shop address', () => {
    const { container } = render(<PanelContent {...defaultProps} />)
    const addressElement = container.querySelector('address')
    expect(addressElement).toBeInTheDocument()
    expect(addressElement).toHaveTextContent(mockShop.properties.address)
  })

  it('renders website link when provided', () => {
    render(<PanelContent {...defaultProps} />)

    const websiteLink = screen.getByRole('link', { name: 'Website' })
    expect(websiteLink).toHaveAttribute('href', mockShop.properties.website)
  })

  // The description intro block is the only <p> with this class combination.
  const descriptionSelector = 'p.text-sm.text-gray-600.leading-relaxed'

  it('renders the description block (trimmed) when description is a non-empty string', () => {
    const shop: TShop = {
      ...mockShop,
      properties: { ...mockShop.properties, description: '  A cozy neighborhood cafe.  ' },
    }
    const { container } = render(<PanelContent {...defaultProps} shop={shop} />)

    const paragraph = container.querySelector(descriptionSelector)
    expect(paragraph).toBeInTheDocument()
    expect(paragraph).toHaveTextContent('A cozy neighborhood cafe.')
  })

  it.each([
    ['undefined', undefined],
    ['null', null],
    ['empty string', ''],
    ['whitespace only', '   '],
  ])('does not render the description block for %s', (_label, description) => {
    const shop: TShop = {
      ...mockShop,
      properties: { ...mockShop.properties, description },
    }
    const { container } = render(<PanelContent {...defaultProps} shop={shop} />)

    expect(container.querySelector(descriptionSelector)).toBeNull()
  })
})
