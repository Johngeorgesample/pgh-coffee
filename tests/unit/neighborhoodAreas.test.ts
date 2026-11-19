import { describe, expect, it } from 'vitest'
import { areaForNeighborhood, areaPath, groupShopsIntoAreas, nearestAreas } from '@/app/utils/neighborhoodAreas'

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

  it('ranks areas by distance from the current area centroid', () => {
    const at = (latitude: number, longitude: number) => ({ latitude, longitude })
    const current = { area: 'Here', shops: [at(40.44, -79.99)] }
    const all = [
      current,
      { area: 'Near', shops: [at(40.45, -79.98)] },
      { area: 'Far', shops: [at(40.6, -80.2)] },
      { area: 'NoCoords', shops: [{ latitude: null, longitude: null }] },
    ]

    // excludes the current area and areas with no coordinates
    expect(nearestAreas(current, all, 5).map(a => a.area)).toEqual(['Near', 'Far'])
  })

  it('builds slugged area paths', () => {
    expect(areaPath('Squirrel Hill')).toBe('/neighborhoods/squirrel-hill')
    expect(areaPath("O'Hara")).toBe('/neighborhoods/o-hara')
  })
})
