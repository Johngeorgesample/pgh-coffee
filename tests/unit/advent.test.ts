import { describe, expect, it } from 'vitest'
import { adventTeaser, daysOpen, parseDayParam, splitMarked } from '@/app/utils/advent'
import { ADVENT_LINEUP } from '@/data/advent'
import { ORDERS } from '@/data/advent-orders'

// The lineup is authored by hand, so a typo here would silently 404 a
// day page or break the roaster link.
describe('lineup', () => {
  it('covers days 1..25 exactly once', () => {
    expect(ADVENT_LINEUP.map(e => e.day)).toEqual(Array.from({ length: 25 }, (_, i) => i + 1))
  })
})

describe('orders', () => {
  it.each(ORDERS.map(o => [o.label, o.sequence]))('%s opens every jar exactly once', (_, sequence) => {
    expect([...sequence].sort((a, b) => a - b)).toEqual(ADVENT_LINEUP.map(e => e.day))
  })
})

describe('daysOpen', () => {
  it('rolls over at midnight Pittsburgh time, not UTC', () => {
    expect(daysOpen(new Date('2026-12-01T03:00:00Z'))).toBe(0)
    expect(daysOpen(new Date('2026-12-01T05:30:00Z'))).toBe(1)
  })

  it('keeps everything open once the calendar is over', () => {
    expect(daysOpen(new Date('2026-12-31T12:00:00Z'))).toBe(25)
    expect(daysOpen(new Date('2027-01-02T12:00:00Z'))).toBe(25)
  })
})

describe('adventTeaser', () => {
  it('counts down, follows the open day, then disappears after Christmas', () => {
    expect(adventTeaser(new Date('2026-11-24T17:00:00Z'))).toBe('Opens in 7 days')
    expect(adventTeaser(new Date('2026-11-30T17:00:00Z'))).toBe('Opens tomorrow')
    expect(adventTeaser(new Date('2026-12-01T17:00:00Z'))).toBe('Day 1 is open')
    expect(adventTeaser(new Date('2026-12-25T17:00:00Z'))).toBe('Day 25 is open')
    expect(adventTeaser(new Date('2026-12-26T17:00:00Z'))).toBeNull()
  })
})

describe('parseDayParam', () => {
  it('accepts the canonical day numbers', () => {
    expect(parseDayParam('1')).toBe(1)
    expect(parseDayParam('25')).toBe(25)
  })

  it('rejects anything that is not one of them', () => {
    for (const raw of ['0', '26', '07', '1e1', '1.0', '-1', 'abc', '', ' 1']) {
      expect(parseDayParam(raw)).toBeNull()
    }
  })
})




describe('splitMarked', () => {
  it('marks bracketed phrases and leaves a stray bracket as text', () => {
    expect(splitMarked('notes of [vanilla] and [baked nuts], 70% [Brazil')).toEqual([
      { text: 'notes of ', marked: false },
      { text: 'vanilla', marked: true },
      { text: ' and ', marked: false },
      { text: 'baked nuts', marked: true },
      { text: ', 70% [Brazil', marked: false },
    ])
  })
})
