import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import useShopsStore from '@/stores/coffeeShopsStore'
import usePanelStore from '@/stores/panelStore'
import ShopDetails from '@/app/components/ShopDetails'
import { ExploreContent } from '@/app/components/ExploreContent'
import { TShop } from '@/types/shop-types'
import { buildShopSlug } from '@/app/utils/shopSlug'

export const useShopRouteSync = () => {
  const { slug } = useParams<{ slug?: string }>()

  // Store actions are read via getState() rather than closed over so the effect
  // genuinely depends only on `slug` — no exhaustive-deps suppression needed.
  useEffect(() => {
    const { currentShop, setCurrentShop } = useShopsStore.getState()

    // Undo the shop selection and panel this hook put up, returning to the
    // explore panel — but only when a shop is actually showing, so we don't
    // clobber a company/roaster/news panel that lives on the bare `/` route.
    const clearShopPanel = () => {
      if (useShopsStore.getState().currentShop?.properties?.uuid) {
        setCurrentShop({} as TShop)
      }
      if (usePanelStore.getState().panelMode === 'shop') {
        usePanelStore.getState().reset({ mode: 'explore', content: <ExploreContent /> })
      }
    }

    if (!slug) {
      clearShopPanel()
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
  }, [slug])
}
