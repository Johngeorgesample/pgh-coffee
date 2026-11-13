import { describe, test, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import useCoffeeShopsStore, { useDisplayedShops } from '@/stores/coffeeShopsStore'
import { TShop } from '@/types/shop-types'

const shop = (name: string, neighborhood: string) =>
  ({ type: 'Feature', geometry: { type: 'Point', coordinates: [-80, 40.4] }, properties: { name, neighborhood, address: name } }) as unknown as TShop

const names = () => renderHook(() => useDisplayedShops()).result.current.features.map(f => f.properties.name)

describe('area filter', () => {
  beforeEach(() => {
    useCoffeeShopsStore.setState({
      allShops: { type: 'FeatureCollection', features: [shop('Commonplace', 'Central Business District'), shop('Downtown Roast', 'Oakland')] },
    })
  })

  test('shows the shops in the area, not shops whose names mention it', () => {
    useCoffeeShopsStore.getState().setAreaFilter('Downtown')
    expect(names()).toEqual(['Commonplace'])
  })

  test('typing a search drops back to text matching', () => {
    useCoffeeShopsStore.getState().setAreaFilter('Downtown')
    useCoffeeShopsStore.getState().setSearchValue('Downtown')
    expect(names()).toEqual(['Downtown Roast'])
  })
})
