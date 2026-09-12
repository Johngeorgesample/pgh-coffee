import { TZ } from '@/app/utils/hours'
import { ADVENT_DAYS, ADVENT_YEAR } from '@/data/advent'

// Pittsburgh-local calendar date, so a door opens at midnight in Pittsburgh
// rather than wherever the server happens to be running.
export const pittsburghDate = (now = new Date()) => {
  const ymd = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
  const [year, month, day] = ymd.split('-').map(Number)
  return { year, month, day }
}

// How many doors are unlocked right now. Once the season is over the whole
// calendar stays open, so a QR scanned off a bag in February still resolves.
export const openDoorCount = (now = new Date()) => {
  const { year, month, day } = pittsburghDate(now)
  if (year !== ADVENT_YEAR) return year > ADVENT_YEAR ? ADVENT_DAYS : 0
  return month < 12 ? 0 : Math.min(day, ADVENT_DAYS)
}

export const isDoorOpen = (day: number, now = new Date()) => day <= openDoorCount(now)

// Only canonical '1'..'24' resolve, so the printed QR codes have exactly one
// URL each and '/advent/07' does not become a duplicate of '/advent/7'.
export const parseDayParam = (raw: string) => {
  const day = Number(raw)
  return Number.isInteger(day) && day >= 1 && day <= ADVENT_DAYS && String(day) === raw ? day : null
}

// ?preview=N lets the team read the pages before December. It only moves the
// door count; it never changes what is stored or indexed.
export const resolveOpenCount = (preview?: string) => {
  const n = Number(preview)
  const valid = preview !== undefined && Number.isInteger(n) && n >= 0 && n <= ADVENT_DAYS
  return valid ? n : openDoorCount()
}

export const formatDoorDate = (day: number) =>
  new Date(Date.UTC(ADVENT_YEAR, 11, day)).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'long',
    day: 'numeric',
  })

// The door that belongs to today, or 0 outside December — after the season every
// door is open and none of them is "today".
export const currentDoor = (now = new Date()) => {
  const { year, month } = pittsburghDate(now)
  return year === ADVENT_YEAR && month === 12 ? openDoorCount(now) : 0
}
