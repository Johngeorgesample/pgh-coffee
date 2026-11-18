import { ADVENT_DAYS, ADVENT_YEAR } from '@/data/advent'

// Only canonical '1'..'25' resolve, so each day has exactly one URL and
// '/advent/07' does not become a duplicate of '/advent/7'.
export const parseDayParam = (raw: string) => {
  const day = Number(raw)
  return Number.isInteger(day) && day >= 1 && day <= ADVENT_DAYS && String(day) === raw ? day : null
}

const pittsburghDate = (now: Date) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(now).split('-').map(Number)

export const daysOpen = (now: Date) => {
  const [year, month, day] = pittsburghDate(now)
  if (year !== ADVENT_YEAR) return year < ADVENT_YEAR ? 0 : ADVENT_DAYS
  return month < 12 ? 0 : Math.min(day, ADVENT_DAYS)
}

export const daysUntilOpening = (now: Date) => {
  const [year, month, day] = pittsburghDate(now)
  return Math.round((Date.UTC(ADVENT_YEAR, 11, 1) - Date.UTC(year, month - 1, day)) / 86_400_000)
}

export const devDayDate = (search: string) => {
  const day = parseDayParam(new URLSearchParams(search).get('dev-day') ?? '')
  return day ? new Date(`${ADVENT_YEAR}-12-${String(day).padStart(2, '0')}T12:00:00-05:00`) : null
}

const AGTRON_DARK = 40
const AGTRON_LIGHT = 100

export const agtronPercent = (agtron: number) =>
  Math.min(1, Math.max(0, (agtron - AGTRON_DARK) / (AGTRON_LIGHT - AGTRON_DARK)))

export const beanShade = (agtron: number) =>
  `color-mix(in oklab, #e6c48f ${Math.round(agtronPercent(agtron) * 100)}%, #2a1608)`

export const splitMarked = (text: string) =>
  text.split(/\[([^\]]+)\]/).map((part, i) => ({ text: part, marked: i % 2 === 1 }))
