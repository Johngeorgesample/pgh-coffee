import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Favorites from '@/app/account/components/Favorites'

vi.mock('@/hooks', () => ({
  useShopSelection: () => ({ handleShopSelect: vi.fn() }),
  useAnalytics: () => vi.fn(),
}))

vi.mock('@/stores/coffeeShopsStore', () => ({
  __esModule: true,
  default: () => ({
    setHoveredShop: vi.fn(),
  }),
}))

const mockShop = {
  uuid: 'shop-uuid-1',
  name: 'Test Coffee Shop',
  neighborhood: 'Downtown',
  address: '123 Main St',
  company: null,
  photo: null,
  photos: null,
  website: 'https://example.com',
  latitude: 40.4363,
  longitude: -79.925,
}

describe('Account Favorites', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', vi.fn())
  })

  it('shows a loading state initially', () => {
    vi.mocked(fetch).mockReturnValue(new Promise(() => {}))
    render(<Favorites />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows the empty state when there are no favorites', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    } as Response)

    render(<Favorites />)

    await waitFor(() => {
      expect(screen.getByText('No favorites yet')).toBeInTheDocument()
    })
  })

  it('renders a ShopCard for each favorite', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        { id: 'fav-1', created_at: '2024-01-01T00:00:00Z', shop: mockShop },
      ]),
    } as Response)

    render(<Favorites />)

    await waitFor(() => {
      expect(screen.getByText('Test Coffee Shop')).toBeInTheDocument()
    })

    expect(screen.queryByText('No favorites yet')).not.toBeInTheDocument()
  })

  it('shows an error state distinct from the empty state when the fetch fails', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: 'Error fetching favorites' }),
    } as Response)

    render(<Favorites />)

    await waitFor(() => {
      expect(screen.getByText("Couldn't load your favorites")).toBeInTheDocument()
    })

    expect(screen.queryByText('No favorites yet')).not.toBeInTheDocument()
  })

  it('shows an error state when the request throws', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

    render(<Favorites />)

    await waitFor(() => {
      expect(screen.getByText("Couldn't load your favorites")).toBeInTheDocument()
    })
  })
})
