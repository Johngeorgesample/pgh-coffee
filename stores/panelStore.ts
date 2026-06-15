import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { ReactNode, isValidElement, ReactElement } from 'react'
import { TShop } from '@/types/shop-types'
import { buildShopSlug } from '@/app/utils/shopSlug'
import useCoffeeShopsStore from './coffeeShopsStore'

type PanelMode = 'explore' | 'search' | 'shop' | 'list' | 'news' | 'events' | 'company' | 'roaster' | 'event'

type PanelEntry = {
  mode: PanelMode
  content: ReactNode
}

const URL_PARAMS = ['shop', 'company', 'roaster', 'news', 'event', 'events'] as const

function hasProps<K extends string>(
  content: ReactNode,
  key: K,
): content is ReactElement<Record<K, unknown>> {
  return (
    isValidElement(content) &&
    typeof content.props === 'object' &&
    content.props !== null &&
    key in content.props
  )
}

type URLTarget = { type: 'path'; value: string } | { type: 'query'; key: string; value: string }

function getURLParamForEntry(entry: PanelEntry): URLTarget | null {
  const { mode, content } = entry

  switch (mode) {
    case 'shop':
      if (hasProps(content, 'shop')) {
        const shop = content.props.shop as TShop
        if (shop?.properties?.name) {
          return { type: 'path', value: `/shops/${buildShopSlug(shop.properties)}` }
        }
      }
      return null
    case 'company':
      if (hasProps(content, 'slug') && content.props.slug) {
        return { type: 'query', key: 'company', value: content.props.slug as string }
      }
      return null
    case 'roaster':
      if (hasProps(content, 'slug') && content.props.slug) {
        return { type: 'query', key: 'roaster', value: content.props.slug as string }
      }
      return null
    case 'news':
      if (hasProps(content, 'id') && content.props.id) {
        return { type: 'query', key: 'news', value: content.props.id as string }
      }
      return { type: 'query', key: 'news', value: '' }
    case 'event':
      if (hasProps(content, 'event')) {
        const event = content.props.event as { id: string }
        if (event?.id) {
          return { type: 'query', key: 'event', value: event.id }
        }
      }
      return null
    case 'events':
      return { type: 'query', key: 'events', value: '' }
    default:
      return null
  }
}

function updateURL(param: URLTarget | null) {
  const url = new URL(window.location.href)
  URL_PARAMS.forEach(p => url.searchParams.delete(p))

  if (param?.type === 'path') {
    url.pathname = param.value
  } else if (param?.type === 'query') {
    url.pathname = '/'
    url.searchParams.set(param.key, param.value)
  } else {
    url.pathname = '/'
  }

  window.history.replaceState({}, '', url.toString())
}

interface PanelState {
  panelMode: PanelMode | null
  panelContent: ReactNode | null
  history: PanelEntry[]

  // setters
  /** Pushes a new panel onto the stack (default). Use opts.push=false to replace. */
  setPanelContent: (content: ReactNode, mode: PanelMode, opts?: { push?: boolean }) => void

  // nav
  back: () => void
  reset: (root?: PanelEntry) => void

  /** Clears the navigation history. Pass { keepCurrent: true } to keep the current panel as the only entry. */
  clearHistory: (opts?: { keepCurrent?: boolean }) => void
}

const usePanelStore = create<PanelState>()(
  devtools(
    (set, get) => ({
      panelMode: 'explore',
      panelContent: null,
      history: [],

      setPanelContent: (content, mode, opts) =>
        set(state => {
          const next: PanelEntry = { mode, content }

          const history = [...state.history, next]

          return { panelContent: content, panelMode: mode, history }
        }),

      back: () =>
        set(state => {
          const { setSearchValue, clearAmenityFilters } = useCoffeeShopsStore.getState()
          setSearchValue('')
          clearAmenityFilters()

          if (state.history.length <= 1) {
            updateURL(null)
            return { history: [], panelMode: 'explore', panelContent: null }
          }

          const history = state.history.slice(0, -1)
          const top = history[history.length - 1]

          updateURL(getURLParamForEntry(top))

          return { history, panelMode: top.mode, panelContent: top.content }
        }),

      reset: root =>
        set(() => {
          const base = root ?? { mode: 'explore' as PanelMode, content: null }
          return { history: [base], panelMode: base.mode, panelContent: base.content }
        }),

      clearHistory: opts =>
        set(state => {
          if (opts?.keepCurrent && state.panelMode) {
            const current: PanelEntry = { mode: state.panelMode, content: state.panelContent }
            return { history: [current] }
          }
          return { history: [] }
        }),
    }),
    { name: 'PanelStore' },
  ),
)

export default usePanelStore
