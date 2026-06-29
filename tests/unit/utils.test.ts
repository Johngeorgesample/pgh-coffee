import { describe, test, expect } from 'vitest'
import { getSynonyms, normalizeSearchText, doesShopMatchFilter, formatDBShopAsFeature } from '@/app/utils/utils'
import { DbShop } from '@/types/shop-types'

const baseShop = {
  name: 'Test Shop',
  neighborhood: 'Strip District',
  address: '1 Main St',
  website: '',
  photo: null,
  photos: null,
  uuid: 'u1',
  latitude: 40.45,
  longitude: -79.98,
  company: { id: 'co1', slug: 'test-co', name: 'Test Co', website: '', description: '', instagram_handle: '' },
} as unknown as DbShop

describe('formatDBShopAsFeature roaster mapping', () => {
  test('marks the roaster in-house when it shares the shop company', () => {
    const feature = formatDBShopAsFeature({
      ...baseShop,
      roasterRef: { name: 'Test Co Roasting', slug: 'test-co', company_id: 'co1' },
    })
    expect(feature.properties.roaster).toEqual({ name: 'Test Co Roasting', slug: 'test-co', inHouse: true })
  })

  test('is not in-house when the roaster belongs to a different company', () => {
    const feature = formatDBShopAsFeature({
      ...baseShop,
      roasterRef: { name: 'Other Roaster', slug: 'other', company_id: 'co2' },
    })
    expect(feature.properties.roaster?.inHouse).toBe(false)
  })

  test('is null when the shop has no roaster', () => {
    expect(formatDBShopAsFeature(baseShop).properties.roaster).toBeNull()
  })
})

describe('getSynonyms', () => {
  test('returns synonyms for "&"', () => {
    const result = getSynonyms('&')
    expect(result).toContain('&')
    expect(result).toContain('and')
  })

  test('returns synonyms for "and"', () => {
    const result = getSynonyms('and')
    expect(result).toContain('and')
    expect(result).toContain('&')
  })

  test('returns synonyms for "café"', () => {
    const result = getSynonyms('café')
    expect(result).toContain('café')
    expect(result).toContain('cafe')
    expect(result).toContain('caffe')
  })

  test('returns synonyms for "cafe"', () => {
    const result = getSynonyms('cafe')
    expect(result).toContain('cafe')
    expect(result).toContain('café')
    expect(result).toContain('caffe')
  })

  test('returns synonyms for "caffe"', () => {
    const result = getSynonyms('caffe')
    expect(result).toContain('caffe')
    expect(result).toContain('café')
    expect(result).toContain('cafe')
  })

  test('returns synonyms for "coffee"', () => {
    const result = getSynonyms('coffee')
    expect(result).toContain('coffee')
    expect(result).toContain('cofee')
  })

  test('returns synonyms for "cofee" (misspelling)', () => {
    const result = getSynonyms('cofee')
    expect(result).toContain('cofee')
    expect(result).toContain('coffee')
  })

  test('returns only the original term when no synonyms exist', () => {
    const result = getSynonyms('unknown')
    expect(result).toEqual(['unknown'])
  })

  test('is case-insensitive', () => {
    const resultUpper = getSynonyms('AND')
    const resultLower = getSynonyms('and')
    expect(resultUpper).toContain('and')
    expect(resultUpper).toContain('&')
    expect(resultLower).toContain('and')
    expect(resultLower).toContain('&')
  })
})

describe('normalizeSearchText', () => {
  test('converts to lowercase', () => {
    expect(normalizeSearchText('HELLO')).toBe('hello')
    expect(normalizeSearchText('Test Shop')).toBe('test shop')
  })

  test('removes diacritical marks', () => {
    expect(normalizeSearchText('café')).toBe('cafe')
    expect(normalizeSearchText('naïve')).toBe('naive')
    expect(normalizeSearchText('résumé')).toBe('resume')
  })

  test('combines lowercase and diacritical mark removal', () => {
    expect(normalizeSearchText('CAFÉ')).toBe('cafe')
    expect(normalizeSearchText('Naïve')).toBe('naive')
  })

  test('handles text without diacritical marks', () => {
    expect(normalizeSearchText('hello world')).toBe('hello world')
    expect(normalizeSearchText('test')).toBe('test')
  })

  test('preserves special characters like &', () => {
    expect(normalizeSearchText('Coffee & Tea')).toBe('coffee & tea')
  })
})

describe('doesShopMatchFilter', () => {
  test('matches all shops when no filter is provided', () => {
    expect(doesShopMatchFilter('Coffee & Tea Shop', 'Downtown')).toBe(true)
    expect(doesShopMatchFilter('Coffee & Tea Shop', 'Downtown', '')).toBe(true)
  })

  test('filters by exact name match', () => {
    expect(doesShopMatchFilter('Café Elegance', 'North Oakland', 'elegance')).toBe(true)
    expect(doesShopMatchFilter('Coffee & Tea Shop', 'Downtown', 'elegance')).toBe(false)
  })

  test('filters by neighborhood', () => {
    expect(doesShopMatchFilter('Café Elegance', 'North Oakland', 'oakland')).toBe(true)
    expect(doesShopMatchFilter('Coffee & Tea Shop', 'Downtown', 'oakland')).toBe(false)
  })

  test('matches "&" when searching for "and"', () => {
    expect(doesShopMatchFilter('Coffee & Tea Shop', 'Downtown', 'and')).toBe(true)
    expect(doesShopMatchFilter('Café Elegance', 'North Oakland', 'and')).toBe(false)
  })

  test('matches "and" when searching for "&"', () => {
    expect(doesShopMatchFilter('Coffee & Tea Shop', 'Downtown', '&')).toBe(true)
    expect(doesShopMatchFilter('Café Elegance', 'North Oakland', '&')).toBe(false)
  })

  test('matches "café" when searching for "cafe" (without accent)', () => {
    expect(doesShopMatchFilter('Café Elegance', 'North Oakland', 'cafe')).toBe(true)
    expect(doesShopMatchFilter('Coffee & Tea Shop', 'Downtown', 'cafe')).toBe(false)
  })

  test('matches "cafe" when searching for "café" (with accent)', () => {
    expect(doesShopMatchFilter('Café Elegance', 'North Oakland', 'café')).toBe(true)
    expect(doesShopMatchFilter('Coffee & Tea Shop', 'Downtown', 'café')).toBe(false)
  })

  test('handles multi-word searches', () => {
    expect(doesShopMatchFilter('Downtown Roasters', 'Shadyside', 'downtown roasters')).toBe(true)
    expect(doesShopMatchFilter('Coffee & Tea Shop', 'Downtown', 'downtown roasters')).toBe(false)
  })

  test('multi-word search with synonym', () => {
    expect(doesShopMatchFilter('Coffee & Tea Shop', 'Downtown', 'coffee and tea')).toBe(true)
    expect(doesShopMatchFilter('Café Elegance', 'North Oakland', 'coffee and tea')).toBe(false)
  })

  test('returns false when filter does not match', () => {
    expect(doesShopMatchFilter('Coffee & Tea Shop', 'Downtown', 'nonexistent')).toBe(false)
  })

  test('is case-insensitive', () => {
    expect(doesShopMatchFilter('Coffee & Tea Shop', 'Downtown', 'DOWNTOWN')).toBe(true)
  })
})
