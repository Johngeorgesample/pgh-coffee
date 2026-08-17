import { describe, test, expect, beforeEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useCompanyRouteSync } from '@/hooks/useCompanyRouteSync'
import { useRoasterRouteSync } from '@/hooks/useRoasterRouteSync'
import { useShopRouteSync } from '@/hooks/useShopRouteSync'
import usePanelStore from '@/stores/panelStore'
import useShopsStore from '@/stores/coffeeShopsStore'
import { buildShopSlug } from '@/app/utils/shopSlug'
import { TShop } from '@/types/shop-types'

const h = vi.hoisted(() => ({ slug: undefined as string | undefined, pathname: '/', search: '' }))

vi.mock('next/navigation', () => ({
  useParams: () => ({ slug: h.slug }),
  usePathname: () => h.pathname,
  useSearchParams: () => new URLSearchParams(h.search),
}))
vi.mock('@/app/components/Company', () => ({ Company: () => null }))
vi.mock('@/app/components/RoasterDetails', () => ({ RoasterDetails: () => null }))
vi.mock('@/app/components/ExploreContent', () => ({ ExploreContent: () => null }))
vi.mock('@/app/components/ShopDetails', () => ({ default: () => null }))

// HomeClient's order: whichever hook is leaving its route runs its teardown
// before the destination's hook can push its panel entry.
const renderRouteSyncs = () =>
  renderHook(() => {
    useShopRouteSync()
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

  test('releases the map filter as soon as the route leaves', () => {
    // The destination's hook installs its panel from a fetch, so <Company> stays
    // mounted — with the map pinned to that company — until it lands. The filter
    // is the route's, not the panel's, so it goes now rather than on unmount.
    h.slug = 'commonplace-coffee-co'
    h.pathname = '/companies/commonplace-coffee-co'
    const { rerender } = renderRouteSyncs()
    useShopsStore.getState().setOverrideShops({ type: 'FeatureCollection', features: [] })

    h.slug = 'latte-art-throwdown-a1b2c3d4'
    h.pathname = '/events/latte-art-throwdown-a1b2c3d4'
    rerender()

    expect(useShopsStore.getState().overrideShops).toBeNull()
  })

  test('keeps the shop entry when navigating to the company that owns it', () => {
    const properties = {
      name: 'De Fer Coffee & Tea',
      neighborhood: 'Downtown',
      uuid: 'abcdef12-3456-7890-abcd-ef1234567890',
    }
    useShopsStore.getState().setCurrentShop({ properties } as TShop)
    usePanelStore.getState().reset({ mode: 'shop', content: null })

    h.slug = buildShopSlug(properties)
    h.pathname = `/shops/${h.slug}`
    const { rerender } = renderRouteSyncs()

    h.slug = 'de-fer-coffee-tea'
    h.pathname = '/companies/de-fer-coffee-tea'
    rerender()

    expect(modes()).toEqual(['shop', 'company'])
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
