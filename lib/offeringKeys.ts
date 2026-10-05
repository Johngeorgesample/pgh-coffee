export const OFFERING_KEYS = [
  // Food — backfilled from amenities (see offerings-schema.sql).
  'pastries',
  'snacks',
  'full_food_menu',
  // Drink specialties — populated via editorial backfill.
  'espresso',
  'pour_over',
  'drip',
  'cold_brew',
  'loose_leaf_tea',
  'matcha',
] as const

export type OfferingKey = (typeof OFFERING_KEYS)[number]
