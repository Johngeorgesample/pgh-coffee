import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { ReactNode, isValidElement, ReactElement } from 'react'
import { TShop } from '@/types/shop-types'
import useCoffeeShopsStore from './coffeeShopsStore'

type PanelMode = 'explore' | 'search' | 'shop' | 'list' | 'news' | 'events' | 'company' | 'roaster' | 'event'

type PanelEntry = {
  mode: PanelMode
  content: ReactNode
}

// Type guard to check if content is a ReactElement with shop props
function hasShopProps(content: ReactNode): content is ReactElement<{ shop: TShop }> {
  return (
    isValidElement(content) &&
    typeof content.props === 'object' &&
    content.props !== null &&
    'shop' in content.props
  )
}

// Type guard to check if content is a ReactElement with company slug props
function hasCompanyProps(content: ReactNode): content is ReactElement<{ slug: string }> {
  return (
    isValidElement(content) &&
    typeof content.props === 'object' &&
    content.props !== null &&
    'slug' in content.props
  )
}

// Type guard to check if content is a ReactElement with roaster slug props
function hasRoasterProps(content: ReactNode): content is ReactElement<{ slug: string }> {
  return (
    isValidElement(content) &&
    typeof content.props === 'object' &&
    content.props !== null &&
    'slug' in content.props
  )
}

// Type guard to check if content is a ReactElement with news id props
function hasNewsProps(content: ReactNode): content is ReactElement<{ id: string }> {
  return (
    isValidElement(content) &&
    typeof content.props === 'object' &&
    content.props !== null &&
    'id' in content.props
  )
}

// Type guard to check if content is a ReactElement with event props
function hasEventProps(content: ReactNode): content is ReactElement<{ event: { id: string } }> {
  return (
    isValidElement(content) &&
    typeof content.props === 'object' &&
    content.props !== null &&
    'event' in content.props
  )
}

interface PanelState {
  panelMode: PanelMode | null
  panelContent: ReactNode | null
  searchValue: string
  history: PanelEntry[]

  // setters
  setSearchValue: (value: string) => void
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
      panelMode: null,
      panelContent: null,
      searchValue: '',
      history: [],

      setSearchValue: value => set({ searchValue: value }),

      setPanelContent: (content, mode, opts) =>
        set(state => {
          const next: PanelEntry = { mode, content }

          const history = [...state.history, next]

          return { panelContent: content, panelMode: mode, history }
        }),

      back: () =>
        set(state => {
          // pop current if present
          let history = state.history.slice(0, -1)

          if (state.searchValue) {
            set({ searchValue: '' })
          }

          // if nothing left, go home
          if (history.length === 0) {
            const url = new URL(window.location.href)
            const baseUrl = url.origin + url.pathname
            window.history.replaceState({}, '', baseUrl)
            return { history: [], panelMode: 'explore', panelContent: null }
          }

          const top = history[history.length - 1]

          const url = new URL(window.location.href)
          const params = new URLSearchParams(url.search)

          if (hasShopProps(top.content) && top.content.props.shop?.properties?.name) {
            params.set(
              'shop',
              `${top.content.props.shop.properties.name}_${top.content.props.shop.properties.neighborhood}`,
            )
            params.delete('company')
            params.delete('roaster')
            params.delete('news')
            params.delete('event')
            url.search = params.toString()
            window.history.replaceState({}, '', url.toString())

            // Reset displayed shops to show all shops when going back to shop page
            const { allShops, setDisplayedShops } = useCoffeeShopsStore.getState()
            setDisplayedShops(allShops)
          } else if (hasCompanyProps(top.content) && top.content.props.slug && top.mode === 'company') {
            params.set('company', top.content.props.slug)
            params.delete('shop')
            params.delete('roaster')
            params.delete('news')
            params.delete('event')
            url.search = params.toString()
            window.history.replaceState({}, '', url.toString())
          } else if (hasRoasterProps(top.content) && top.content.props.slug && top.mode === 'roaster') {
            params.set('roaster', top.content.props.slug)
            params.delete('shop')
            params.delete('company')
            params.delete('news')
            params.delete('event')
            url.search = params.toString()
            window.history.replaceState({}, '', url.toString())
          } else if (hasNewsProps(top.content) && top.content.props.id && top.mode === 'news') {
            params.set('news', top.content.props.id)
            params.delete('shop')
            params.delete('company')
            params.delete('roaster')
            params.delete('event')
            url.search = params.toString()
            window.history.replaceState({}, '', url.toString())
          } else if (top.mode === 'news' && !hasNewsProps(top.content)) {
            // News list (no id prop)
            const baseUrl = url.origin + url.pathname
            window.history.replaceState({}, '', baseUrl + '?news')
          } else if (hasEventProps(top.content) && top.content.props.event?.id && top.mode === 'event') {
            params.set('event', top.content.props.event.id)
            params.delete('shop')
            params.delete('company')
            params.delete('roaster')
            params.delete('news')
            url.search = params.toString()
            window.history.replaceState({}, '', url.toString())
          } else if (top.mode === 'events') {
            const baseUrl = url.origin + url.pathname
            window.history.replaceState({}, '', baseUrl + '?events')
          } else {
            params.delete('shop')
            params.delete('company')
            params.delete('roaster')
            params.delete('news')
            params.delete('event')
            params.delete('events')
            url.search = params.toString()
            window.history.replaceState({}, '', url.toString())
          }
          return { history, panelMode: top.mode, panelContent: top.content }
        }),

      reset: root =>
        set(() => {
          const base = root ?? { mode: 'explore' as PanelMode, content: null }
          return { history: [base], panelMode: base.mode, panelContent: base.content, searchValue: '' }
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
