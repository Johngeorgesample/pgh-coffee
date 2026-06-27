import type { OfferingKey } from './offeringKeys'

export { OFFERING_KEYS, type OfferingKey } from './offeringKeys'

// Offerings render as plain text pills (no icons), unlike amenities.
export const offeringMap = {
  pastries: { label: 'Pastries' },
  snacks: { label: 'Snacks' },
  full_food_menu: { label: 'Full Food Menu' },
  espresso: { label: 'Espresso' },
  pour_over: { label: 'Pour Over' },
  drip: { label: 'Drip Coffee' },
  cold_brew: { label: 'Cold Brew' },
  loose_leaf_tea: { label: 'Loose-leaf Tea' },
  matcha: { label: 'Matcha' },
} satisfies Record<OfferingKey, { label: string }>

export const getOffering = (key: string): { label: string } | undefined =>
  (offeringMap as Record<string, { label: string }>)[key]
