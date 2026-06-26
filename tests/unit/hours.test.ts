import { describe, it, expect } from 'vitest'
import { HoursRow, formatTime, isOpenNow } from '@/lib/hours'

// day_of_week: 0=Sun .. 6=Sat
const row = (day: number, opens: string, closes: string, spans = false): HoursRow => ({
  day_of_week: day,
  opens_at: opens,
  closes_at: closes,
  spans_midnight: spans,
})

const at = (day: number, hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return { day, minutes: h * 60 + m }
}

describe('formatTime', () => {
  it('formats whole hours, half hours, midnight and noon', () => {
    expect(formatTime('07:00:00')).toBe('7 AM')
    expect(formatTime('06:30:00')).toBe('6:30 AM')
    expect(formatTime('00:00:00')).toBe('12 AM')
    expect(formatTime('12:00:00')).toBe('12 PM')
    expect(formatTime('13:05:00')).toBe('1:05 PM')
    expect(formatTime('23:59:00')).toBe('11:59 PM')
  })
})

describe('isOpenNow', () => {
  it('returns false when there are no rows', () => {
    expect(isOpenNow([], at(1, '10:00'))).toBe(false)
  })

  it('treats the open window as half-open [opens, closes)', () => {
    const rows = [row(1, '07:00:00', '15:00:00')] // Mon 7 AM – 3 PM
    expect(isOpenNow(rows, at(1, '10:00'))).toBe(true)
    expect(isOpenNow(rows, at(1, '06:00'))).toBe(false)
    expect(isOpenNow(rows, at(1, '15:00'))).toBe(false) // closing minute is closed
  })

  it('ignores rows for other days', () => {
    const rows = [row(1, '07:00:00', '15:00:00')] // Mon only
    expect(isOpenNow(rows, at(2, '10:00'))).toBe(false) // Tue
  })

  it('handles a row spanning midnight on both sides of the boundary', () => {
    const rows = [row(5, '11:00:00', '02:00:00', true)] // Fri 11 AM – 2 AM
    expect(isOpenNow(rows, at(5, '23:00'))).toBe(true) // Fri 11 PM
    expect(isOpenNow(rows, at(6, '01:00'))).toBe(true) // Sat 1 AM (spill)
    expect(isOpenNow(rows, at(6, '03:00'))).toBe(false) // Sat 3 AM (after close)
    expect(isOpenNow(rows, at(5, '10:00'))).toBe(false) // Fri 10 AM (before open)
  })

  it('treats a midnight close (00:00) as closing exactly at midnight', () => {
    const rows = [row(5, '18:00:00', '00:00:00', true)] // Fri 6 PM – 12 AM
    expect(isOpenNow(rows, at(5, '19:00'))).toBe(true) // Fri 7 PM
    expect(isOpenNow(rows, at(6, '01:00'))).toBe(false) // Sat 1 AM — empty next-day slice
  })
})
