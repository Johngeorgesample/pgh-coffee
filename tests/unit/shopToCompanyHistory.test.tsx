import { test, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useShopRouteSync } from '@/hooks/useShopRouteSync'
import { useCompanyRouteSync } from '@/hooks/useCompanyRouteSync'
import usePanelStore from '@/stores/panelStore'
import useShopsStore from '@/stores/coffeeShopsStore'
import { buildShopSlug } from '@/app/utils/shopSlug'
import { TShop } from '@/types/shop-types'

const h = vi.hoisted(() => ({ slug: undefined as string | undefined, pathname: '/' }))

vi.mock('next/navigation', () => ({ useParams: () => ({ slug: h.slug }), usePathname: () => h.pathname }))
vi.mock('@/app/components/Company', () => ({ Company: () => null }))
vi.mock('@/app/components/ShopDetails', () => ({ default: () => null }))
vi.mock('@/app/components/ExploreContent', () => ({ ExploreContent: () => null }))

test("following a shop's company link keeps the shop entry to go back to", () => {
  const properties = { name: 'De Fer Coffee & Tea', neighborhood: 'Downtown', uuid: 'abcdef12-3456-7890-abcd-ef1234567890' }
  useShopsStore.getState().setCurrentShop({ properties } as TShop)
  usePanelStore.getState().reset({ mode: 'shop', content: null })
  h.slug = buildShopSlug(properties)
  h.pathname = `/shops/${h.slug}`
  const { rerender } = renderHook(() => {
    useShopRouteSync()
    useCompanyRouteSync()
  })

  h.slug = 'de-fer-coffee-tea'
  h.pathname = '/companies/de-fer-coffee-tea'
  rerender()

  expect(usePanelStore.getState().history.map(e => e.mode)).toEqual(['shop', 'company'])
  expect(useShopsStore.getState().currentShop.properties).toBeUndefined()
})
