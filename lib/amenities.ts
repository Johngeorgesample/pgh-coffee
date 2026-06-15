// Canonical list of amenity keys accepted by the amenity report API.
// Keep in sync with `amenityMap` in app/components/AmenityChip.tsx
// (tests/unit/amenities.test.ts asserts the two stay in sync).
export const AMENITY_KEYS = [
  'free_wifi',
  'no_wifi',
  'onsite_parking',
  'street_parking',
  'garage_nearby',
  'pastries',
  'snacks',
  'full_food_menu',
  'dogs_inside',
  'dogs_patio',
  'patio_seating',
  'sidewalk_seating',
  'outlets_abundant',
  'outlets_limited',
  'seating_spacious',
  'seating_moderate',
  'seating_tight',
  'cash_only',
  'card_only',
  'restroom',
  'no_restroom',
] as const

export type AmenityKey = typeof AMENITY_KEYS[number]
