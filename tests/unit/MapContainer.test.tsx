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
    // @ts-expect-error
    render(<MapContainer displayedShops={dataSet} currentShopCoordinates={dataSet.features[0].geometry.coordinates} />)

    const mapContainer = screen.getByTestId('map-container')

    expect(mapContainer).toBeInTheDocument()
  })
})
