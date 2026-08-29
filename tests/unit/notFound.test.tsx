import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import NotFound from '@/app/not-found'
import HomeClient from '@/app/components/HomeClient'
import usePanelStore from '@/stores/panelStore'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/companies/does-not-exist',
  useParams: () => ({ slug: 'does-not-exist' }),
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('next-plausible', () => ({ usePlausible: () => vi.fn() }))

beforeAll(() => {
  globalThis.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })
  globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) })
})

afterEach(() => {
  usePanelStore.setState({ hidden: false })
})

describe('404 under the map layout', () => {
  it('keeps HomeClient from rendering the map and panel', () => {
    const { unmount } = render(<NotFound />)
    render(<HomeClient />)

    expect(screen.queryByTestId('map-placeholder')).toBeNull()
    expect(screen.queryByTestId('shop-panel')).toBeNull()

    unmount()
    expect(usePanelStore.getState().hidden).toBe(false)
  })
})
