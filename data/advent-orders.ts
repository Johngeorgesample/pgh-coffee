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
    id: 'roast',
    label: 'Light to dark',
    blurb: 'Start with the lightest roast and finish with the darkest. Jar numbers jump around, so check which one to open.',
    sequence: [19, 13, 9, 6, 2, 17, 25, 18, 1, 23, 11, 14, 4, 10, 24, 20, 22, 16, 5, 8, 21, 15, 3, 7, 12],
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

export const jarOgHref = (order: Order, jar: number) => `/advent/${jar}/og${orderQuery(order)}`

export const jarsInOrder = (order: Order) =>
  order.sequence.map((jar, i) => ({ step: i + 1, entry: findAdventDay(jar)!, href: jarHref(order, jar) }))
