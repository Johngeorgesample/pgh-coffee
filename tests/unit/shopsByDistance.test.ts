import { describe, expect, it } from 'vitest'
import { shopsByDistance } from '@/app/utils/shopsByDistance'
import { TShop } from '@/types/shop-types'

const shop = (name: string, coordinates: [number, number]) =>
  ({ type: 'Feature', geometry: { type: 'Point', coordinates }, properties: { name } }) as unknown as TShop

describe('shopsByDistance', () => {
  it('orders shops closest-first from a [lng, lat] point', () => {
    const downtown: [number, number] = [-79.9959, 40.4406]
    const shops = [
      shop('Squirrel Hill', [-79.9225, 40.4381]),
      shop('Lawrenceville', [-79.9605, 40.4652]),
      shop('Market Square', [-79.9973, 40.4407]),
    ]

    const result = shopsByDistance(shops, downtown)

    expect(result.map(r => r.shop.properties.name)).toEqual(['Market Square', 'Lawrenceville', 'Squirrel Hill'])
    expect(result[0].meters).toBeLessThan(200)
  })
})
