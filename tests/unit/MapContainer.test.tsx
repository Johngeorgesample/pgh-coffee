import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import MapContainer from '@/app/components/MapContainer'
import { TShop } from '@/types/shop-types'
import { TNeighborhood } from '@/types/neighborhood-types'

vi.mock('react-map-gl', () => {
  return {
    default: ({ children }: any) => <div>{children}</div>,
    Source: ({ children }: any) => <div>{children}</div>,
    Layer: ({ children }: any) => <div>{children}</div>,
  }
})

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
        },
        geometry: {
          type: 'Point',
          coordinates: [-79.893948, 40.432417] as [number, number],
        },
      },
    ],
  }

  const currentShop: TShop = dataSet.features[0]

  it('renders the MapContainer component and displays the map', () => {
    render(<MapContainer dataSet={dataSet} currentShop={currentShop} onShopSelect={mockOnShopSelect} />)

    const mapContainer = screen.getByTestId('map-container')

    expect(mapContainer).toBeInTheDocument()
  })
})
