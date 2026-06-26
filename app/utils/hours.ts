// Pure time helpers for the shop hours display. Kept out of the client
// component so the open-now / midnight logic can be unit-tested in isolation.

export const TZ = 'America/New_York'

// One schedule row as stored in shop_hours. Times arrive as 'HH:MM:SS'.
export interface HoursRow {
  day_of_week: number // 0=Sun .. 6=Sat
  opens_at: string
  closes_at: string
  spans_midnight: boolean
}

export interface PghTime {
  day: number // 0=Sun .. 6=Sat
  minutes: number // minutes since local midnight
}

export const toMinutes = (time: string): number => {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

// '07:00:00' -> '7 AM', '06:30:00' -> '6:30 AM', '00:00:00' -> '12 AM'
export const formatTime = (time: string): string => {
  const [h, m] = time.split(':').map(Number)
  const period = h < 12 ? 'AM' : 'PM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return m === 0 ? `${hour12} ${period}` : `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

// Pittsburgh-local "now", so open-now and the highlighted row stay correct no
// matter the viewer's timezone (stored times are America/New_York wall-clock).
export const pittsburghNow = (): PghTime => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date())
  const get = (t: string) => parts.find(p => p.type === t)?.value ?? ''
  const dayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  return { day: dayMap[get('weekday')], minutes: Number(get('hour')) * 60 + Number(get('minute')) }
}

export const isOpenNow = (rows: HoursRow[], now: PghTime): boolean => {
  const prevDay = (now.day + 6) % 7
  return rows.some(r => {
    const opens = toMinutes(r.opens_at)
    const closes = toMinutes(r.closes_at)
    if (r.spans_midnight) {
      // Opens on its day and runs past midnight: open [opens, 24:00) on the row's
      // day, then [00:00, closes) the next day. A 00:00 close makes the next-day
      // slice empty, so 1 AM correctly reads as closed.
      if (r.day_of_week === now.day && now.minutes >= opens) return true
      if (r.day_of_week === prevDay && now.minutes < closes) return true
      return false
    }
    return r.day_of_week === now.day && now.minutes >= opens && now.minutes < closes
  })
}
