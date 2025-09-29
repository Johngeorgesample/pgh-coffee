import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { ReactNode } from 'react'

type PanelMode = 'explore' | 'search' | 'shop' | 'list' | 'news' | 'events'

type PanelEntry = {
  mode: PanelMode
  content: ReactNode
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
          const pushRequested = opts?.push ?? true
          const shouldPush = pushRequested

          const next: PanelEntry = { mode, content }

          const history = shouldPush
            ? [...state.history, next]
            : state.history.length
              ? [...state.history.slice(0, -1), next]
              : [next]

          return { panelContent: content, panelMode: mode, history }
        }),

      back: () =>
        set(state => {
          // pop current if present
          let history = state.history.slice(0, -1)

          // if nothing left, go home
          if (history.length === 0) {
            return { history: [], panelMode: 'explore', panelContent: null }
          }

          const top = history[history.length - 1]

          const url = new URL(window.location.href)
          const params = new URLSearchParams(url.search)
          params.set(
            'shop',
            `${top.content.props.shop.properties.name}_${top.content.props.shop.properties.neighborhood}`,
          )
          url.search = params.toString()
          console.log(url.toString())
          window.history.replaceState({}, '', url.toString())
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
