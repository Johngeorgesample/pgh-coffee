import { describe, test, expect } from 'vitest'
import { getSynonyms, normalizeSearchText } from '@/app/utils/utils'

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
