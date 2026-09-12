import { describe, expect, it } from 'vitest'
import { currentDoor, openDoorCount, parseDayParam, resolveOpenCount } from '@/app/utils/advent'
import { ADVENT_LINEUP, ADVENT_YEAR, findAdventDay, otherDaysFor } from '@/data/advent'

// The lineup is authored by hand, so a typo here would silently 404 a printed
// QR code or break the roaster link.
describe('lineup', () => {
  it('covers days 1..24 exactly once', () => {
    expect(ADVENT_LINEUP.map(e => e.day)).toEqual(Array.from({ length: 24 }, (_, i) => i + 1))
  })

  it('pairs a roaster on two days with each other', () => {
    const dayOne = findAdventDay(1)!
    expect(otherDaysFor(dayOne).map(e => e.day)).toEqual([24])
  })
})

describe('openDoorCount', () => {
  const at = (iso: string) => openDoorCount(new Date(iso))

  it('keeps every door shut before December', () => {
    expect(at(`${ADVENT_YEAR}-11-30T12:00:00Z`)).toBe(0)
    expect(at(`${ADVENT_YEAR}-09-12T12:00:00Z`)).toBe(0)
  })

  it('opens one door per day through the 24th', () => {
    expect(at(`${ADVENT_YEAR}-12-01T05:00:01Z`)).toBe(1)
    expect(at(`${ADVENT_YEAR}-12-08T17:00:00Z`)).toBe(8)
    expect(at(`${ADVENT_YEAR}-12-24T17:00:00Z`)).toBe(24)
  })

  it('stops at 24 rather than counting on to the 31st', () => {
    expect(at(`${ADVENT_YEAR}-12-25T17:00:00Z`)).toBe(24)
    expect(at(`${ADVENT_YEAR}-12-31T17:00:00Z`)).toBe(24)
  })

  it('leaves the calendar open in later years, so an old bag still scans', () => {
    expect(at(`${ADVENT_YEAR + 1}-02-14T12:00:00Z`)).toBe(24)
  })

  it('counts the day in Pittsburgh, not UTC', () => {
    // 23:30 ET on the 7th is already the 8th in UTC — door 8 must stay shut.
    expect(at(`${ADVENT_YEAR}-12-08T04:30:00Z`)).toBe(7)
    // And midnight ET on the 8th opens it.
    expect(at(`${ADVENT_YEAR}-12-08T05:00:01Z`)).toBe(8)
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

describe('resolveOpenCount', () => {
  it('honours a valid preview override', () => {
    expect(resolveOpenCount('12')).toBe(12)
    expect(resolveOpenCount('0')).toBe(0)
  })

  it('falls back to the real count when the override is junk', () => {
    expect(resolveOpenCount('99')).toBe(openDoorCount())
    expect(resolveOpenCount('nope')).toBe(openDoorCount())
    expect(resolveOpenCount(undefined)).toBe(openDoorCount())
  })
})

describe('currentDoor', () => {
  it('is the day of the month during the season', () => {
    expect(currentDoor(new Date(`${ADVENT_YEAR}-12-08T17:00:00Z`))).toBe(8)
  })

  it('is nothing once the season is over, when every door is open', () => {
    expect(currentDoor(new Date(`${ADVENT_YEAR + 1}-02-14T12:00:00Z`))).toBe(0)
    expect(currentDoor(new Date(`${ADVENT_YEAR}-11-30T12:00:00Z`))).toBe(0)
  })
})
