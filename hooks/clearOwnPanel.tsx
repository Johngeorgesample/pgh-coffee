import usePanelStore, { PanelMode } from '@/stores/panelStore'
import { ExploreContent } from '@/app/components/ExploreContent'

/**
 * A route-sync hook owns the panel only while its own route is showing. Leaving
 * that route through a bare `/` link — the 404's "Go home", the account pages —
 * never goes through `handleClose`, so without this the panel outlives its
 * route. The mode check keeps a hook from clobbering a panel that another
 * route's hook set in the same pass.
 */
export const clearOwnPanel = (...modes: PanelMode[]) => {
  const { panelMode, reset } = usePanelStore.getState()
  if (!panelMode || !modes.includes(panelMode)) return
  reset({ mode: 'explore', content: <ExploreContent /> })
}
