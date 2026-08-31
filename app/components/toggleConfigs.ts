import { Heart, Stamp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface ToggleToastConfig {
  // Classes beyond the button's activeIconClassName (e.g. an entrance
  // animation) — the toast icon is otherwise the same color as the active
  // button icon, so that part isn't repeated here.
  extraIconClassName?: string
  verbPhrase: string
  viewHref: string
  viewLabel: string
}

export interface ToggleConfig {
  apiPath: string
  analyticsEvent: string
  noun: string
  Icon: LucideIcon
  activeIconClassName: string
  ariaLabelActive: string
  ariaLabelInactive: string
  toast: ToggleToastConfig
}

export const FAVORITE_TOGGLE_CONFIG: ToggleConfig = {
  apiPath: '/api/favorites',
  analyticsEvent: 'favorite',
  noun: 'favorite',
  Icon: Heart,
  activeIconClassName: 'fill-red-500 text-red-500',
  ariaLabelActive: 'Favorited',
  ariaLabelInactive: 'Favorite',
  toast: {
    verbPhrase: 'added to favorites',
    viewHref: '/account/favorites',
    viewLabel: 'View favorites',
  },
}

export const VISITED_TOGGLE_CONFIG: ToggleConfig = {
  apiPath: '/api/visits',
  analyticsEvent: 'visited',
  noun: 'visited',
  Icon: Stamp,
  activeIconClassName: 'fill-green-500 text-white',
  ariaLabelActive: 'Visited',
  ariaLabelInactive: 'Mark as visited',
  toast: {
    extraIconClassName: 'animate-stamp motion-reduce:animate-none',
    verbPhrase: 'marked as visited',
    viewHref: '/account/visited',
    viewLabel: 'View passport',
  },
}
