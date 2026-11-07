import { describe, it, expect, vi, beforeEach } from 'vitest'
import { forwardRef, useImperativeHandle } from 'react'
import { render } from '@testing-library/react'
import MapContainer from '@/app/components/MapContainer'
import useShopsStore, { useDisplayedShops } from '@/stores/coffeeShopsStore'
import { useShopSelection, useShopsInView } from '@/hooks'

const flyTo = vi.fn()

vi.mock('react-map-gl', () => ({
  default: forwardRef(({ children }: any, ref: any) => {
    useImperativeHandle(ref, () => ({ flyTo, getZoom: () => 12, getMap: () => null }))
    return <div>{children}</div>
  }),
  Source: ({ children }: any) => <div>{children}</div>,
  Layer: () => null,
}))

vi.mock('@/stores/coffeeShopsStore', () => ({
  default: vi.fn(),
  useDisplayedShops: vi.fn(),
}))

vi.mock('@/hooks', () => ({
  useShopSelection: vi.fn(),
  useShopsInView: vi.fn(),
}))

describe('MapContainer panning', () => {
  beforeEach(() => {
    flyTo.mockClear()
    vi.mocked(useDisplayedShops).mockReturnValue({ type: 'FeatureCollection', features: [] } as any)
    vi.mocked(useShopsStore).mockReturnValue(undefined as any)
    vi.mocked(useShopSelection).mockReturnValue({ handleShopSelect: vi.fn() } as any)
    vi.mocked(useShopsInView).mockReturnValue({ shopsInView: [], updateBounds: vi.fn() } as any)
  })

  it('pans to the selected shop', () => {
    render(<MapContainer currentShopCoordinates={[-79.99, 40.44]} />)

    expect(flyTo).toHaveBeenCalledTimes(1)
    expect(flyTo).toHaveBeenCalledWith(expect.objectContaining({ center: [-79.99, 40.44] }))
  })

  it('does not pan again when a re-render passes an equal coordinate array', () => {
    const { rerender } = render(<MapContainer currentShopCoordinates={[-79.99, 40.44]} />)
    flyTo.mockClear()

    rerender(<MapContainer currentShopCoordinates={[-79.99, 40.44]} />)

    expect(flyTo).not.toHaveBeenCalled()
  })

  it('pans when the selected shop actually changes', () => {
    const { rerender } = render(<MapContainer currentShopCoordinates={[-79.99, 40.44]} />)
    flyTo.mockClear()

    rerender(<MapContainer currentShopCoordinates={[-79.92, 40.46]} />)

    expect(flyTo).toHaveBeenCalledWith(expect.objectContaining({ center: [-79.92, 40.46] }))
  })
})
