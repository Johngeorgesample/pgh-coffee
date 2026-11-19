export const DISTANCE_UNITS = { Meters: 'Meters', Miles: 'Miles' } as const

export type TUnits = (typeof DISTANCE_UNITS)[keyof typeof DISTANCE_UNITS]

export const DEFAULT_UNITS: TUnits = DISTANCE_UNITS.Miles

export const DISTANCE_UNITS_STORAGE_KEY = 'distanceUnits'

export const parseUnits = (stored: string | null | undefined): TUnits =>
  stored === DISTANCE_UNITS.Miles || stored === DISTANCE_UNITS.Meters ? stored : DEFAULT_UNITS

const MILES_PER_METER = 0.000621371

export const metersToUnits = (meters: number, units: TUnits) =>
  units === DISTANCE_UNITS.Miles ? meters * MILES_PER_METER : meters
