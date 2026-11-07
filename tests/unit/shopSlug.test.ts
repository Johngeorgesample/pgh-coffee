import { describe, test, expect } from 'vitest'
import { buildShopSlug, slugify, extractUuidPrefix } from '@/app/utils/shopSlug'

describe('slugify', () => {
  test('lowercases and hyphenates spaces', () => {
    expect(slugify('61B Cafe')).toBe('61b-cafe')
    expect(slugify('Regent Square')).toBe('regent-square')
  })

  test('strips diacritical marks', () => {
    expect(slugify('Café Sam')).toBe('cafe-sam')
  })

  test('collapses non-alphanumeric runs and trims leading/trailing hyphens', () => {
    expect(slugify('Yinz Coffee & Tea!')).toBe('yinz-coffee-tea')
    expect(slugify('--Leading and Trailing--')).toBe('leading-and-trailing')
  })
})

describe('buildShopSlug', () => {
  test('combines slugified name, neighborhood, and 8-char uuid prefix', () => {
    const slug = buildShopSlug({
      name: '61B Cafe',
      neighborhood: 'Regent Square',
      uuid: 'a1b2c3d4-0000-0000-0000-000000000000',
    })
    expect(slug).toBe('61b-cafe-regent-square-a1b2c3d4')
  })

  test('produces distinct slugs for shops sharing a name and neighborhood', () => {
    const shared = { name: 'Yinz Coffee', neighborhood: 'Downtown' }
    const a = buildShopSlug({ ...shared, uuid: '11111111-0000-0000-0000-000000000000' })
    const b = buildShopSlug({ ...shared, uuid: '22222222-0000-0000-0000-000000000000' })

    expect(a).not.toBe(b)
    expect(a).toBe('yinz-coffee-downtown-11111111')
    expect(b).toBe('yinz-coffee-downtown-22222222')
  })
})

describe('extractUuidPrefix', () => {
  test('extracts the trailing 8 hex characters', () => {
    expect(extractUuidPrefix('61b-cafe-regent-square-a1b2c3d4')).toBe('a1b2c3d4')
  })

  test('lowercases the extracted prefix', () => {
    expect(extractUuidPrefix('61b-cafe-regent-square-A1B2C3D4')).toBe('a1b2c3d4')
  })

  test('returns null when the slug has no uuid suffix', () => {
    expect(extractUuidPrefix('not-a-real-slug')).toBeNull()
    expect(extractUuidPrefix('too-short-abc123')).toBeNull()
  })
})
