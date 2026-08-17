// The persisted values are capitalized because they double as the user-facing
// labels in the settings UI, so they are the canonical spelling rather than a
// storage detail to be normalized away.
export const DISTANCE_UNITS = { Meters: 'Meters', Miles: 'Miles' } as const

export type TUnits = (typeof DISTANCE_UNITS)[keyof typeof DISTANCE_UNITS]

export const DEFAULT_UNITS: TUnits = DISTANCE_UNITS.Miles

export const DISTANCE_UNITS_STORAGE_KEY = 'distanceUnits'

// Storage holds `null` (never written), `''` (stored blank), or an unrecognized
// value from an older build. Collapsing all three to the default here is what
// lets readers treat the preference as always present — a default written on
// visit can be missed by a user who never opens settings, a default derived on
// read cannot.
export const parseUnits = (stored: string | null | undefined): TUnits =>
  stored === DISTANCE_UNITS.Miles || stored === DISTANCE_UNITS.Meters ? stored : DEFAULT_UNITS
