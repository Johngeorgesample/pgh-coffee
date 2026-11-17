import { ADVENT_LINEUP, findAdventDay } from '@/data/advent'

export type Order = { id: string; label: string; blurb: string; sequence: number[] }

const range = ADVENT_LINEUP.map(entry => entry.day)

export const ORDERS: Order[] = [
  {
    id: 'curated',
    label: 'Curated',
    blurb: 'The order Dylan at Dynamic Coffee Roasters picked. Jar numbers follow this order, so each day is simply the next jar.',
    sequence: range,
  },
  {
    id: 'geo',
    label: 'North to south',
    blurb: 'Start with the roaster farthest north and work your way south across the region. Jar numbers jump around, so check which one to open.',
    sequence: [22, 3, 9, 14, 1, 24, 2, 10, 12, 6, 5, 4, 15, 8, 7, 11, 13, 16, 17, 18, 19, 20, 21, 23, 25],
  },
  {
    id: 'founded',
    label: 'Oldest first',
    blurb: 'Start with the longest-running roaster and finish with the newest. Jar numbers jump around, so check which one to open.',
    sequence: [12, 22, 1, 24, 2, 5, 3, 23, 7, 14, 6, 9, 4, 15, 8, 10, 11, 13, 16, 17, 18, 19, 20, 21, 25],
  },
]

export const jarsInOrder = (order: Order) =>
  order.sequence.map((jar, i) => ({ step: i + 1, entry: findAdventDay(jar)! }))
