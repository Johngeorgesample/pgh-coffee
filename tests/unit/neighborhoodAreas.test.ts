import { describe, expect, it } from 'vitest'
import { areaForNeighborhood, areaPath, groupShopsIntoAreas } from '@/app/utils/neighborhoodAreas'

describe('neighborhood areas', () => {
  it('folds granular neighborhoods into their searchable area', () => {
    expect(areaForNeighborhood('Central Lawrenceville')).toBe('Lawrenceville')
    expect(areaForNeighborhood('Squirrel Hill South')).toBe('Squirrel Hill')
    expect(areaForNeighborhood('Central Business District')).toBe('Downtown')
  })

  it('passes ungrouped neighborhoods through unchanged', () => {
    expect(areaForNeighborhood('Shadyside')).toBe('Shadyside')
  })

  it('merges grouped neighborhoods and sorts areas by shop count', () => {
    const shop = (neighborhood: string) => ({ neighborhood })
    const areas = groupShopsIntoAreas([
      shop('Central Lawrenceville'),
      shop('Lower Lawrenceville'),
      shop('Upper Lawrenceville'),
      shop('Shadyside'),
      shop('Shadyside'),
    ])

    expect(areas.map(a => [a.area, a.shops.length])).toEqual([
      ['Lawrenceville', 3],
      ['Shadyside', 2],
    ])
  })

  it('builds slugged area paths', () => {
    expect(areaPath('Squirrel Hill')).toBe('/neighborhoods/squirrel-hill')
    expect(areaPath("O'Hara")).toBe('/neighborhoods/o-hara')
  })
})
