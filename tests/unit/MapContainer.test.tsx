import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import MapContainer from '@/app/components/MapContainer'
import { TNeighborhood } from '@/types/neighborhood-types'
import useShopsStore, { useDisplayedShops } from '@/stores/coffeeShopsStore'
import { useShopSelection } from '@/hooks'

vi.mock('react-map-gl', () => {
  return {
    default: ({ children }: any) => <div>{children}</div>,
    Source: ({ children }: any) => <div>{children}</div>,
    Layer: ({ children }: any) => <div>{children}</div>,
  }
})

vi.mock('@/stores/coffeeShopsStore', () => ({
  default: vi.fn(),
  useDisplayedShops: vi.fn(),
}))

vi.mock('@/hooks', () => ({
  useShopSelection: vi.fn(),
}))

describe.skip('MapContainer', () => {
  const mockOnShopSelect = vi.fn()

  const dataSet = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          name: 'Test Shop',
          neighborhood: 'Downtown' as TNeighborhood,
          address: '123 Fake St, Pittsburgh, PA 15218',
          website: '',
          photo: 'foo',
          uuid: '1234',
        },
        geometry: {
          type: 'Point',
          coordinates: [-79.893948, 40.432417] as [number, number],
        },
      },
    ],
  }

  it('renders the MapContainer component and displays the map', () => {
    vi.mocked(useDisplayedShops).mockReturnValue(dataSet as any)
    vi.mocked(useShopsStore).mockReturnValue({
      allShops: dataSet,
      fetchCoffeeShops: vi.fn(),
      setAllShops: vi.fn(),
      currentShop: dataSet.features[0],
      setCurrentShop: vi.fn(),
      hoveredShop: null,
      setHoveredShop: vi.fn(),
      searchValue: '',
      setSearchValue: vi.fn(),
      activeAmenityFilters: [],
      toggleAmenityFilter: vi.fn(),
      clearAmenityFilters: vi.fn(),
      overrideShops: null,
      setOverrideShops: vi.fn(),
    } as any)

    vi.mocked(useShopSelection).mockReturnValue({
      handleShopSelect: mockOnShopSelect,
    })

    render(<MapContainer currentShopCoordinates={dataSet.features[0].geometry.coordinates} />)

    const mapContainer = screen.getByTestId('map-container')

    expect(mapContainer).toBeInTheDocument()
  })
})
