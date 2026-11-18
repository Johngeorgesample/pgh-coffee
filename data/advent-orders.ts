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
    sequence: [22, 14, 17, 13, 8, 16, 1, 23, 2, 25, 21, 12, 3, 6, 15, 11, 24, 19, 20, 5, 9, 18, 4, 10, 7],
  },
  {
    id: 'founded',
    label: 'Oldest first',
    blurb: 'Start with the longest-running roaster and finish with the newest. Jar numbers jump around, so check which one to open.',
    sequence: [3, 12, 21, 14, 2, 19, 16, 17, 11, 15, 24, 10, 22, 5, 20, 4, 1, 23, 25, 8, 6, 9, 7, 13, 18],
  },
]

export const findOrder = (id?: string) => ORDERS.find(order => order.id === id) ?? ORDERS[0]

export const stepOf = (order: Order, jar: number) => order.sequence.indexOf(jar) + 1

const orderQuery = (order: Order) => (order === ORDERS[0] ? '' : `?order=${order.id}`)

export const calendarHref = (order: Order) => `/advent${orderQuery(order)}`

export const jarHref = (order: Order, jar: number) => `/advent/${jar}${orderQuery(order)}`

export const jarsInOrder = (order: Order) =>
  order.sequence.map((jar, i) => ({ step: i + 1, entry: findAdventDay(jar)!, href: jarHref(order, jar) }))
