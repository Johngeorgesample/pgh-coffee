import { describe, test, expect } from 'vitest'
import { AMENITY_KEYS } from '@/lib/amenities'
import { amenityMap } from '@/app/components/AmenityChip'

describe('AMENITY_KEYS', () => {
  test('stays in sync with AmenityChip amenityMap', () => {
    expect(new Set(AMENITY_KEYS)).toEqual(new Set(Object.keys(amenityMap)))
  })

  test('has no duplicate entries', () => {
    expect(new Set(AMENITY_KEYS).size).toBe(AMENITY_KEYS.length)
  })
})
