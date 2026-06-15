import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import MapContainerLazy from '@/app/components/MapContainerLazy'

// Stand in for the real (mapbox-gl-heavy) MapContainer so the dynamic import
// resolves instantly and we can assert on mount timing without loading mapbox.
vi.mock('@/app/components/MapContainer', () => ({
  default: () => <div data-testid="map-real">map</div>,
}))

// Capture the idle callback so the test controls when "first paint" idle fires.
let idleCb: (() => void) | null = null

beforeEach(() => {
  idleCb = null
  vi.stubGlobal('requestIdleCallback', (cb: () => void) => {
    idleCb = cb
    return 1
  })
  vi.stubGlobal('cancelIdleCallback', vi.fn())
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('MapContainerLazy', () => {
  it('renders only the placeholder before the idle callback fires', () => {
    render(<MapContainerLazy currentShopCoordinates={[0, 0]} />)

    expect(screen.getByTestId('map-placeholder')).toBeInTheDocument()
    expect(screen.queryByTestId('map-real')).not.toBeInTheDocument()
  })

  it('mounts the map once the browser is idle', async () => {
    render(<MapContainerLazy currentShopCoordinates={[0, 0]} />)

    expect(idleCb).toBeTypeOf('function')
    idleCb!()

    await waitFor(() => expect(screen.getByTestId('map-real')).toBeInTheDocument())
    expect(screen.queryByTestId('map-placeholder')).not.toBeInTheDocument()
  })
})
