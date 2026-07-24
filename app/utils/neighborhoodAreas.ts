import { slugify } from '@/app/utils/shopSlug'

// Granular DB neighborhoods folded into the area names people actually search
// for ("coffee shops in Lawrenceville", not "Central Lawrenceville").
const AREA_GROUPS: Record<string, string> = {
  'Central Lawrenceville': 'Lawrenceville',
  'Lower Lawrenceville': 'Lawrenceville',
  'Upper Lawrenceville': 'Lawrenceville',
  'Squirrel Hill North': 'Squirrel Hill',
  'Squirrel Hill South': 'Squirrel Hill',
  'Central Oakland': 'Oakland',
  'North Oakland': 'Oakland',
  'South Oakland': 'Oakland',
  'West Oakland': 'Oakland',
  'South Side Flats': 'South Side',
  'South Side Slopes': 'South Side',
  'North Point Breeze': 'Point Breeze',
  'South Point Breeze': 'Point Breeze',
  'Central Business District': 'Downtown',
}

export function areaForNeighborhood(neighborhood: string): string {
  return AREA_GROUPS[neighborhood] ?? neighborhood
}

export function areaPath(area: string): string {
  return `/neighborhoods/${slugify(area)}`
}

export function shopNoun(count: number): string {
  return count === 1 ? 'shop' : 'shops'
}

/**
 * Groups shops into searchable areas, sorted by shop count so index pages lead
 * with the densest areas.
 */
export function groupShopsIntoAreas<T extends { neighborhood: string }>(shops: T[]): { area: string; shops: T[] }[] {
  const byArea = new Map<string, T[]>()
  for (const shop of shops) {
    const area = areaForNeighborhood(shop.neighborhood)
    byArea.set(area, [...(byArea.get(area) ?? []), shop])
  }
  return Array.from(byArea)
    .map(([area, areaShops]) => ({ area, shops: areaShops }))
    .sort((a, b) => b.shops.length - a.shops.length)
}
