import lineup from './advent.json'

// The advent calendar lineup: a Dynamic Coffee Roasters box, one Pittsburgh
// roaster's coffee per day, with the reading for each day hosted here.
//
// The lineup lives in advent.json. Only list coffee details a roaster has sent us;
// anything unconfirmed stays "To be announced". Days 11, 13 and 16-21 still hold
// placeholder roasters. `roasterSlug` should match a row in the `roaster` table,
// or the day page drops its roaster section.
//
// Only `day`, `roasterSlug`, `roasterName`, `coffee` and `notes` are required;
// everything else renders when present, so entries can be filled in over time.

export const ADVENT_DAYS = 24

export interface AdventDay {
  day: number
  roasterSlug: string
  roasterName: string
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

export const findAdventDay = (day: number) => ADVENT_LINEUP.find(entry => entry.day === day)
