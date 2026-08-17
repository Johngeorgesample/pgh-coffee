import { describe, test, expect } from 'vitest'
import { DEFAULT_UNITS, DISTANCE_UNITS, parseUnits } from '@/types/unit-types'

// parseUnits is the single point where an untrusted storage value becomes a
// TUnits. Every reader depends on it never handing back something the
// formatters can't render, which is the bug that hid the distance label.
describe('parseUnits', () => {
  test('passes through the two real units', () => {
    expect(parseUnits('Miles')).toBe(DISTANCE_UNITS.Miles)
    expect(parseUnits('Meters')).toBe(DISTANCE_UNITS.Meters)
  })

  test('defaults when nothing is stored', () => {
    expect(parseUnits(null)).toBe(DEFAULT_UNITS)
    expect(parseUnits(undefined)).toBe(DEFAULT_UNITS)
  })

  test('defaults for a stored-but-blank value', () => {
    expect(parseUnits('')).toBe(DEFAULT_UNITS)
  })

  // 'kilometers' was a member of the old TUnits union that nothing ever wrote,
  // and 'miles' was the lowercase initial state that matched no formatter branch.
  test('defaults for legacy and unrecognized values', () => {
    expect(parseUnits('kilometers')).toBe(DEFAULT_UNITS)
    expect(parseUnits('miles')).toBe(DEFAULT_UNITS)
    expect(parseUnits('MILES')).toBe(DEFAULT_UNITS)
    expect(parseUnits('garbage')).toBe(DEFAULT_UNITS)
  })

  test('the default is one of the real units', () => {
    expect(Object.values(DISTANCE_UNITS)).toContain(DEFAULT_UNITS)
  })
})
