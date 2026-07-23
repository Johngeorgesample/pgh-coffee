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

  it('merges grouped neighborhoods and drops areas below the page threshold', () => {
    const shop = (neighborhood: string) => ({ neighborhood })
    const areas = groupShopsIntoAreas([
      shop('Central Lawrenceville'),
      shop('Lower Lawrenceville'),
      shop('Upper Lawrenceville'),
      shop('Shadyside'),
      shop('Shadyside'),
    ])

    expect(areas).toHaveLength(1)
    expect(areas[0].area).toBe('Lawrenceville')
    expect(areas[0].shops).toHaveLength(3)
  })

  it('builds slugged area paths', () => {
    expect(areaPath('Squirrel Hill')).toBe('/neighborhoods/squirrel-hill')
    expect(areaPath("O'Hara")).toBe('/neighborhoods/o-hara')
  })
})
