import { render, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import MapContainer from '@/app/components/MapContainer'
import { TShop } from '@/types/shop-types'
import { TNeighborhood } from '@/types/neighborhood-types'

describe('MapContainer', () => {
  const mockOnShopSelect = vi.fn()

  const dataSet = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          name: '61B Cafe',
          neighborhood: 'Downtown' as TNeighborhood,
          address: '1108 S Braddock Ave, Pittsburgh, PA 15218',
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

  it('renders the map', () => {
    render(<MapContainer dataSet={dataSet} currentShop={currentShop} onShopSelect={mockOnShopSelect} />)
  })
})
