import { ADVENT_DAYS } from '@/data/advent'

// Only canonical '1'..'24' resolve, so the printed QR codes have exactly one
// URL each and '/advent/07' does not become a duplicate of '/advent/7'.
export const parseDayParam = (raw: string) => {
  const day = Number(raw)
  return Number.isInteger(day) && day >= 1 && day <= ADVENT_DAYS && String(day) === raw ? day : null
}
