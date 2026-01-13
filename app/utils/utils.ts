import { DbShop, TFeatureCollection } from '@/types/shop-types'

export const formatDataToGeoJSON = (shops: DbShop[]): TFeatureCollection => {
  const myObj: TFeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  }

  shops.forEach(shop => {
    myObj.features.push({
      type: 'Feature',
      properties: {
        name: shop.name,
        company: shop.company,
        neighborhood: shop.neighborhood,
        website: shop.website,
        address: shop.address,
        photo: shop.photo ?? undefined,
        photos: shop.photos ?? undefined,
        uuid: shop.uuid
      },
      geometry: {
        type: 'Point',
        coordinates: [shop.longitude ?? 0, shop.latitude ?? 0],
      },
    })
  })

  return myObj
}

export const formatDBShopAsFeature = (shop: DbShop): TFeatureCollection['features'][number] => {
  return (
    {
      type: 'Feature',
      properties: {
        name: shop.name,
        company: shop.company,
        neighborhood: shop.neighborhood,
        website: shop.website,
        address: shop.address,
        photo: shop.photo ?? undefined,
        photos: shop.photos ?? undefined,
        uuid: shop.uuid
      },
      geometry: {
        type: 'Point',
        coordinates: [shop.longitude ?? 0, shop.latitude ?? 0],
      }
    }
  )
}

export const parseYMDLocal = (ymd: string) => {
  const [y, m, d] = ymd.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const fmtYMD = (ymd?: string) =>
  ymd
    ? new Intl.DateTimeFormat(undefined, { dateStyle: 'short' }).format(parseYMDLocal(ymd))
    : ''

/**
 * Checks if a date is in the past.
 * Normalizes both dates to midnight for date-only comparison.
 * An event today is considered NOT past.
 */
export const isPast = (date: string) => {
  const eventDate = new Date(date)
  eventDate.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return eventDate.getTime() < today.getTime()
}

/**
 * Synonym map for search functionality.
 * Each key maps to an array of alternative terms.
 * The map is automatically made bidirectional by expandSynonymMap().
 */
const baseSynonymMap: Record<string, string[]> = {
  '&': ['and'],
  'café': ['cafe', 'caffe'],
  'coffee': ['cofee'],
  'ghost': ['trace'],
}

/**
 * Expands the base synonym map to be bidirectional.
 * For example, if '&' maps to ['and'], this ensures 'and' also maps to ['&'].
 */
const expandSynonymMap = (baseMap: Record<string, string[]>): Record<string, string[]> => {
  const expanded: Record<string, string[]> = {}

  // First, copy all base mappings
  Object.entries(baseMap).forEach(([key, values]) => {
    expanded[key] = [...values]
  })

  // Then, add reverse mappings
  Object.entries(baseMap).forEach(([key, values]) => {
    values.forEach((synonym) => {
      if (!expanded[synonym]) {
        expanded[synonym] = []
      }
      if (!expanded[synonym].includes(key)) {
        expanded[synonym].push(key)
      }
      // Also add other synonyms in the same group
      values.forEach((otherSynonym) => {
        if (otherSynonym !== synonym && !expanded[synonym].includes(otherSynonym)) {
          expanded[synonym].push(otherSynonym)
        }
      })
    })
  })

  return expanded
}

const synonymMap = expandSynonymMap(baseSynonymMap)

/**
 * Gets all synonym variations for a given search term.
 * Returns an array containing the original term plus all its synonyms.
 */
export const getSynonyms = (term: string): string[] => {
  const normalizedTerm = term.toLowerCase()
  const synonyms = synonymMap[normalizedTerm] || []
  return [normalizedTerm, ...synonyms]
}

/**
 * Normalizes text for search by converting to lowercase and removing diacritical marks.
 * This is used to match text with accents (e.g., 'café') to text without (e.g., 'cafe').
 */
export const normalizeSearchText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/**
 * Checks if a shop matches the given search filter.
 * Uses word boundary matching and synonym expansion for accurate filtering.
 * Matches the beginning of words (e.g., "common" matches "commonplace").
 */
export const doesShopMatchFilter = (shopName: string, shopNeighborhood: string, filter?: string): boolean => {
  if (!filter) return true

  const shopCardText = normalizeSearchText(`${shopNeighborhood} ${shopName}`)
  const filterWords = filter.toLowerCase().trim().split(/\s+/)

  return filterWords.every((word) => {
    const synonyms = getSynonyms(word)

    return synonyms.some((synonym) => {
      const normalizedSynonym = normalizeSearchText(synonym)
      const escapedSynonym = normalizedSynonym.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const isAlphanumeric = /^[a-z0-9]+$/i.test(normalizedSynonym)
      const regex = isAlphanumeric
        ? new RegExp(`\\b${escapedSynonym}`, 'i')
        : new RegExp(`(?<![a-z0-9])${escapedSynonym}`, 'i')
      return regex.test(shopCardText)
    })
  })
}
