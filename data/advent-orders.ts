import { ADVENT_LINEUP, findAdventDay } from '@/data/advent'

export type Order = { id: string; label: string; blurb: string; sequence: number[] }

const range = ADVENT_LINEUP.map(entry => entry.day)

export const ORDERS: Order[] = [
  {
    id: 'curated',
    label: 'Curated',
    blurb: 'The order picked by Dynamic Coffee Roasters and Origin Coffee Club. Jar numbers follow this order, so each day is simply the next jar.',
    sequence: range,
  },
  {
    id: 'geo',
    label: 'North to south',
    blurb: 'Start with the roaster farthest north and work your way south across the region. Jar numbers jump around, so check which one to open.',
    sequence: [7, 9, 12, 6, 16, 24, 5, 13, 8, 11, 10, 2, 1, 4, 3, 14, 15, 17, 18, 19, 20, 21, 22, 23, 25],
  },
  {
    id: 'founded',
    label: 'Oldest first',
    blurb: 'Start with the longest-running roaster and finish with the newest. Jar numbers jump around, so check which one to open.',
    sequence: [8, 7, 16, 24, 5, 10, 9, 23, 3, 6, 11, 12, 2, 1, 4, 13, 14, 15, 17, 18, 19, 20, 21, 22, 25],
  },
]

export const jarsInOrder = (order: Order) =>
  order.sequence.map((jar, i) => ({ step: i + 1, entry: findAdventDay(jar)! }))
