import { DbShop } from './shop-types'

export type TagKey =
  | 'opening'
  | 'closure'
  | 'temporary closure'
  | 'coming soon'
  | 'event'
  | 'seasonal'
  | 'menu'
  | 'offering'

export type NewsItem = {
  id?: string
  title: string
  description?: string | null
  url?: string | null
  tags?: string[] | null
  post_date?: string | null
  event_date?: string | null
  shop_id?: string
  shop?: DbShop
}

export const TAG_LABELS: Record<TagKey, string> = {
  opening: 'New Shop',
  closure: 'Closing',
  'temporary closure': 'Temporary Closure',
  'coming soon': 'Coming Soon',
  event: 'Event',
  seasonal: 'Seasonal',
  menu: 'Menu Update',
  offering: 'Offering',
}

export const TAG_STYLES: Record<TagKey, { badge: string; border: string }> = {
  opening: {
    badge: 'bg-green-50 text-green-600 border-green-100',
    border: 'border-green-500',
  },
  closure: {
    badge: 'bg-red-50 text-red-600 border-red-100',
    border: 'border-red-500',
  },
  'temporary closure': {
    badge: 'bg-amber-50 text-amber-600 border-amber-100',
    border: 'border-amber-500',
  },
  'coming soon': {
    badge: 'bg-blue-50 text-blue-600 border-blue-100',
    border: 'border-blue-500',
  },
  event: {
    badge: 'bg-amber-50 text-amber-600 border-amber-100',
    border: 'border-amber-500',
  },
  seasonal: {
    badge: 'bg-orange-50 text-orange-600 border-orange-100',
    border: 'border-orange-500',
  },
  menu: {
    badge: 'bg-teal-50 text-teal-600 border-teal-100',
    border: 'border-teal-500',
  },
  offering: {
    badge: 'bg-purple-50 text-purple-600 border-purple-100',
    border: 'border-purple-500',
  },
}

export const DEFAULT_TAG_STYLE = {
  badge: 'bg-stone-50 text-stone-600 border-stone-100',
  border: 'border-primary',
}

export const getTagStyle = (tag?: string) => {
  if (!tag) return DEFAULT_TAG_STYLE
  return TAG_STYLES[tag as TagKey] ?? DEFAULT_TAG_STYLE
}

export const getTagLabel = (tag?: string) => {
  if (!tag) return 'News'
  return TAG_LABELS[tag as TagKey] ?? tag.toUpperCase()
}
