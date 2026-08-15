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

type Located = { latitude: number | null; longitude: number | null }

function centroid(shops: Located[]): [number, number] | null {
  const pts = shops.filter(s => s.latitude != null && s.longitude != null)
  if (pts.length === 0) return null
  const lat = pts.reduce((sum, s) => sum + s.latitude!, 0) / pts.length
  const lng = pts.reduce((sum, s) => sum + s.longitude!, 0) / pts.length
  return [lat, lng]
}

// Squared distance with longitude scaled by cos(latitude) so it's comparable to
// latitude degrees at Pittsburgh's latitude — enough to rank nearest areas
// without the cost of haversine.
function squaredDistance(a: [number, number], b: [number, number]): number {
  const dLat = a[0] - b[0]
  const dLng = (a[1] - b[1]) * Math.cos((a[0] * Math.PI) / 180)
  return dLat * dLat + dLng * dLng
}

/** The `count` areas geographically closest to `current`, nearest first. */
export function nearestAreas<T extends { area: string; shops: Located[] }>(current: T, all: T[], count: number): T[] {
  const origin = centroid(current.shops)
  if (!origin) return []
  return all
    .filter(other => other.area !== current.area)
    .map(other => ({ other, c: centroid(other.shops) }))
    .filter((x): x is { other: T; c: [number, number] } => x.c !== null)
    .sort((x, y) => squaredDistance(origin, x.c) - squaredDistance(origin, y.c))
    .slice(0, count)
    .map(x => x.other)
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
