import { describe, test, expect, beforeEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useCompanyRouteSync } from '@/hooks/useCompanyRouteSync'
import { useRoasterRouteSync } from '@/hooks/useRoasterRouteSync'
import usePanelStore from '@/stores/panelStore'

const h = vi.hoisted(() => ({ slug: undefined as string | undefined, pathname: '/', search: '' }))

vi.mock('next/navigation', () => ({
  useParams: () => ({ slug: h.slug }),
  usePathname: () => h.pathname,
  useSearchParams: () => new URLSearchParams(h.search),
}))
vi.mock('@/app/components/Company', () => ({ Company: () => null }))
vi.mock('@/app/components/RoasterDetails', () => ({ RoasterDetails: () => null }))
vi.mock('@/app/components/ExploreContent', () => ({ ExploreContent: () => null }))

// HomeClient calls the company hook before the roaster hook, so a
// company -> roaster navigation runs the company teardown first. It must not
// wipe the history the roaster panel is about to be pushed onto.
const renderRouteSyncs = () =>
  renderHook(() => {
    useCompanyRouteSync()
    useRoasterRouteSync()
  })

const modes = () => usePanelStore.getState().history.map(entry => entry.mode)

describe('route sync panel history', () => {
  beforeEach(() => {
    usePanelStore.getState().reset({ mode: 'explore', content: null })
    usePanelStore.getState().clearHistory()
    useShopsStore.getState().setOverrideShops(null)
    h.slug = undefined
    h.pathname = '/'
    h.search = ''
  })

  test('keeps the company entry when navigating to its in-house roaster', () => {
    h.slug = 'commonplace-coffee-co'
    h.pathname = '/companies/commonplace-coffee-co'
    const { rerender } = renderRouteSyncs()

    h.slug = 'commonplace-roasting'
    h.pathname = '/roasters/commonplace-roasting'
    rerender()

    expect(modes()).toEqual(['company', 'roaster'])
  })

  test('keeps the roaster entry when navigating to its parent company', () => {
    h.slug = 'commonplace-roasting'
    h.pathname = '/roasters/commonplace-roasting'
    const { rerender } = renderRouteSyncs()

    h.slug = 'commonplace-coffee-co'
    h.pathname = '/companies/commonplace-coffee-co'
    rerender()

    expect(modes()).toEqual(['roaster', 'company'])
  })

  test('drops the company panel when landing on the bare map route', () => {
    h.slug = 'commonplace-coffee-co'
    h.pathname = '/companies/commonplace-coffee-co'
    const { rerender } = renderRouteSyncs()

    h.slug = undefined
    h.pathname = '/'
    rerender()

    expect(usePanelStore.getState().panelMode).toBe('explore')
    expect(modes()).toEqual(['explore'])
  })

  test('does not re-push the company entry when the panel back button returns to it', () => {
    h.slug = 'commonplace-coffee-co'
    h.pathname = '/companies/commonplace-coffee-co'
    const { rerender } = renderRouteSyncs()

    h.slug = 'commonplace-roasting'
    h.pathname = '/roasters/commonplace-roasting'
    rerender()

    // The panel back button pops to the company entry and navigates back to its
    // route; the route catching up must not push a second company entry, or the
    // next back press looks like it does nothing.
    usePanelStore.getState().back()
    h.slug = 'commonplace-coffee-co'
    h.pathname = '/companies/commonplace-coffee-co'
    rerender()

    expect(modes()).toEqual(['company'])
  })

  test('keeps the map filter when handing off to another filter-owning route', () => {
    h.slug = 'commonplace-roasting'
    h.pathname = '/roasters/commonplace-roasting'
    const { rerender } = renderRouteSyncs()
    const filter = { type: 'FeatureCollection' as const, features: [] }
    useShopsStore.getState().setOverrideShops(filter)

    h.slug = 'de-fer-roasting'
    h.pathname = '/roasters/de-fer-roasting'
    rerender()

    // <RoasterDetails> installs the new filter once its fetch resolves; clearing
    // it here would un-filter the map for the whole request.
    expect(useShopsStore.getState().overrideShops).toBe(filter)
  })

  test('releases the map filter when the destination panel never arrives', () => {
    // A valid /events/{slug} whose fetch fails: useEventRouteSync only logs, so no
    // panel replaces <Company> and it stays mounted with the map pinned to that
    // company. (A *dead* slug can't reach this — the page calls notFound(), which
    // unmounts the map layout and the panel with it.)
    h.slug = 'commonplace-coffee-co'
    h.pathname = '/companies/commonplace-coffee-co'
    const { rerender } = renderRouteSyncs()
    useShopsStore.getState().setOverrideShops({ type: 'FeatureCollection', features: [] })

    h.slug = 'latte-art-throwdown-a1b2c3d4'
    h.pathname = '/events/latte-art-throwdown-a1b2c3d4'
    rerender()

    expect(useShopsStore.getState().overrideShops).toBeNull()
  })

  test('leaves the panel alone when a query param owns it on /', () => {
    h.slug = 'commonplace-coffee-co'
    h.pathname = '/companies/commonplace-coffee-co'
    const { rerender } = renderRouteSyncs()

    h.slug = undefined
    h.pathname = '/'
    h.search = '?news'
    rerender()

    expect(usePanelStore.getState().panelMode).toBe('company')
  })
})
