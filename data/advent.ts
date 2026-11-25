import lineup from './advent.json'

// The advent calendar lineup: a Dynamic Coffee Roasters box, one Pittsburgh
// roaster's coffee per day, with the reading for each day hosted here.
//
// The lineup lives in advent.json. Only list coffee details a roaster has sent us;
// anything unconfirmed stays "To be announced". `roasterSlug` should match a row in the `roaster` table,
// or the day page drops its roaster section.
//
// Only `day`, `roasterName`, `coffee` and `notes` are required;
// everything else renders when present, so entries can be filled in over time.

export const ADVENT_DAYS = 25
export const ADVENT_YEAR = 2026

export interface AdventDay {
  day: number
  // Absent until the day's roaster is confirmed.
  roasterSlug?: string
  roasterName: string
  founded?: number
  agtron?: number
  coffee: string
  notes: string[]
  producer?: string
  origin?: string
  varietal?: string
  process?: string
  roast?: string
  blurb?: string
  // YouTube id for the roaster's brew video. Absent until the video is recorded.
  videoId?: string
}

export const ADVENT_LINEUP: AdventDay[] = lineup

export const ANNOUNCED_ROASTERS: { name: string; slug?: string }[] = [
  { name: '19 Coffee', slug: '19-coffee' },
  { name: 'Allegheny Coffee & Tea Exchange', slug: 'allegheny-coffee-and-tea-exchange' },
  { name: 'Aspen Coffee Co.', slug: 'aspen-coffee-co' },
  { name: 'Burning Oaks Coffee Company', slug: 'burning-oaks-coffee-company' },
  { name: 'Colombino Coffee', slug: 'colombino-coffee' },
  { name: 'Commonplace Coffee', slug: 'commonplace' },
  { name: 'De Fer Coffee & Tea', slug: 'de-fer-coffee-and-tea' },
  { name: 'Dynamic Coffee Roasters', slug: 'dynamic-coffee-roasters' },
  { name: 'Ghost Coffee Collab', slug: 'ghost-coffee-collab' },
  { name: 'Hilltop Coffee' },
  { name: "It's Still Coffee", slug: 'its-still-coffee' },
  { name: 'Macizo', slug: 'macizo' },
  { name: "Reginald's Coffee", slug: 'reginalds-coffee' },
  { name: "Rockin' Cat", slug: 'rockin-cat' },
  { name: 'Standing Wave Coffee', slug: 'standing-wave-coffee' },
]

export const findAdventDay = (day: number) => ADVENT_LINEUP.find(entry => entry.day === day)

export const adventCoffeeId = (day: number) => `advent-${ADVENT_YEAR}-${day}`

export const JOURNAL_LIMITS = { tasted: 20, note: 50, method: 100, body: 2000 }

export const findAdventDayByCoffeeId = (coffeeId: string) => ADVENT_LINEUP.find(entry => adventCoffeeId(entry.day) === coffeeId)
