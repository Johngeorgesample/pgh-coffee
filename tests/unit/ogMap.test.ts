import { describe, expect, it } from 'vitest'
import { toMapPixel } from '@/app/utils/ogMap'

const view = { lng: -80, lat: 40.44, zoom: 11, width: 1200, height: 630 }

describe('toMapPixel', () => {
  it('places shops east of the center to the right and south of it lower down', () => {
    const downtown = toMapPixel(view, -80, 40.44)
    const mtLebanon = toMapPixel(view, -80.05, 40.38)
    const squirrelHill = toMapPixel(view, -79.92, 40.43)

    expect(downtown).toEqual({ left: 600, top: 315 })
    expect(mtLebanon.left).toBeLessThan(600)
    expect(mtLebanon.top).toBeGreaterThan(315)
    expect(squirrelHill.left - 600).toBeCloseTo(0.08 * (512 * 2 ** 11) / 360, 6)
  })
})
