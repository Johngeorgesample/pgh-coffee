import { describe, it, expect, vi, beforeEach } from 'vitest'
import { forwardRef, useImperativeHandle } from 'react'
import { act, render } from '@testing-library/react'
import MapContainer from '@/app/components/MapContainer'
import useShopsStore, { useDisplayedShops } from '@/stores/coffeeShopsStore'
import { useShopSelection, useShopsInView } from '@/hooks'

const fitBounds = vi.fn()
let mapProps: any

vi.mock('react-map-gl', () => ({
  default: forwardRef((props: any, ref: any) => {
    mapProps = props
    useImperativeHandle(ref, () => ({ flyTo: vi.fn(), getZoom: () => 12, getMap: () => ({ fitBounds }) }))
    return <div>{props.children}</div>
  }),
  Source: ({ children }: any) => <div>{children}</div>,
  Layer: () => null,
}))
vi.mock('@/stores/coffeeShopsStore', () => ({ default: vi.fn(), useDisplayedShops: vi.fn(), useIsClosed: () => () => false }))
vi.mock('@/app/components/MapChips', () => ({ default: () => null }))
vi.mock('@/hooks', () => ({ useShopSelection: vi.fn(), useShopsInView: vi.fn(), useAnalytics: () => vi.fn() }))

const shops = (coords: [number, number][]) =>
  ({ type: 'FeatureCollection', features: coords.map(c => ({ geometry: { coordinates: c }, properties: {} })) }) as any

describe('MapContainer neighborhood fit', () => {
  beforeEach(() => {
    fitBounds.mockClear()
    window.history.replaceState(null, '', '/?neighborhood=Downtown')
    vi.mocked(useShopsStore).mockReturnValue(undefined as any)
    vi.mocked(useShopSelection).mockReturnValue({ handleShopSelect: vi.fn() } as any)
    vi.mocked(useShopsInView).mockReturnValue({ shopsInView: [], updateBounds: vi.fn() } as any)
  })

  it('fits to the area once shops arrive, however long after the map loads', () => {
    vi.mocked(useDisplayedShops).mockReturnValue(shops([]))
    const { rerender } = render(<MapContainer currentShopCoordinates={[0, 0]} />)
    act(() => mapProps.onLoad({ target: { getBounds: () => null } }))
    expect(fitBounds).not.toHaveBeenCalled()

    vi.mocked(useDisplayedShops).mockReturnValue(shops([[-80.0, 40.44], [-79.99, 40.45], [0, 0]]))
    rerender(<MapContainer currentShopCoordinates={[0, 0]} />)

    expect(fitBounds).toHaveBeenCalledTimes(1)
    expect(fitBounds.mock.calls[0][0]).toEqual([-80.0, 40.44, -79.99, 40.45])
  })
})
