import { useEffect } from 'react'
import { useParams, usePathname, useSearchParams } from 'next/navigation'
import useShopsStore from '@/stores/coffeeShopsStore'
import usePanelStore from '@/stores/panelStore'
import ShopDetails from '@/app/components/ShopDetails'
import { ExploreContent } from '@/app/components/ExploreContent'
import { TShop } from '@/types/shop-types'
import { buildShopSlug } from '@/app/utils/shopSlug'
import { isPanelOwnedRoute } from '@/app/utils/panelRoutes'

export const useShopRouteSync = () => {
  const { slug } = useParams<{ slug?: string }>()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // `slug` is shared by every [slug] route (shops, events, news), so only act
  // when we're actually on a shop page.
  const onShopRoute = pathname.startsWith('/shops/')
  const destinationOwnsPanel = !onShopRoute && isPanelOwnedRoute(pathname, searchParams)

  // Store actions are read via getState() rather than closed over so the effect
  // depends only on the values below — no exhaustive-deps suppression.
  useEffect(() => {
    const { currentShop, setCurrentShop } = useShopsStore.getState()

    // Always drop the selected shop when one is set, so the map marker
    // de-highlights.
    const clearSelectedShop = () => {
      if (useShopsStore.getState().currentShop?.properties?.uuid) {
        setCurrentShop({} as TShop)
      }
    }

    // Only reset the panel when a shop panel is actually showing, so we don't
    // clobber a company/roaster/news panel that lives on the bare `/` route.
    const clearShopPanel = () => {
      clearSelectedShop()
      if (usePanelStore.getState().panelMode === 'shop') {
        usePanelStore.getState().reset({ mode: 'explore', content: <ExploreContent /> })
      }
    }

    if (!onShopRoute || !slug) {
      // Leaving for a route whose own hook installs the panel (the shop panel's
      // "Part of {company}" button, say): let it, or the reset here would wipe the
      // history its entry is about to be pushed onto.
      if (destinationOwnsPanel) clearSelectedShop()
      else clearShopPanel()
      return
    }

    // Skip the fetch when the shop was already selected from the map before the
    // route caught up.
    if (currentShop?.properties && buildShopSlug(currentShop.properties) === slug) {
      return
    }

    const controller = new AbortController()
    fetch(`/api/shops/by-slug/${encodeURIComponent(slug)}`, { signal: controller.signal })
      .then(async res => {
        if (!res.ok) {
          // Surface the actual status so a 500 logs as an outage, not a 404.
          const message = await res.json().then(body => body?.message).catch(() => null)
          throw new Error(`Shop fetch failed (${res.status})${message ? `: ${message}` : ''}`)
        }
        return res.json()
      })
      .then(data => {
        useShopsStore.getState().setCurrentShop(data)
        usePanelStore.getState().setPanelContent(<ShopDetails shop={data} />, 'shop')
      })
      .catch(err => {
        if (err.name === 'AbortError') return
        // Unresolvable slug or fetch failure: drop any stale shop details
        // instead of leaving the previous shop's panel visible.
        console.error(err)
        clearShopPanel()
      })

    return () => controller.abort()
  }, [slug, onShopRoute, destinationOwnsPanel])
}
