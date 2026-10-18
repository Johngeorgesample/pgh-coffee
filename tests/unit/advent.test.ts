import { describe, expect, it } from 'vitest'
import { parseDayParam } from '@/app/utils/advent'
import { ADVENT_LINEUP } from '@/data/advent'

// The lineup is authored by hand, so a typo here would silently 404 a printed
// QR code or break the roaster link.
describe('lineup', () => {
  it('covers days 1..24 exactly once', () => {
    expect(ADVENT_LINEUP.map(e => e.day)).toEqual(Array.from({ length: 24 }, (_, i) => i + 1))
  })
})

describe('parseDayParam', () => {
  it('accepts the canonical day numbers', () => {
    expect(parseDayParam('1')).toBe(1)
    expect(parseDayParam('24')).toBe(24)
  })

  it('rejects anything that is not one of them', () => {
    for (const raw of ['0', '25', '07', '1e1', '1.0', '-1', 'abc', '', ' 1']) {
      expect(parseDayParam(raw)).toBeNull()
    }
  })
})



