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
          const isLateralShop = state.panelMode === 'shop' && mode === 'shop'
          const shouldPush = pushRequested && !isLateralShop

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
          if (state.history.length <= 1) return state

          // pop current
          let history = state.history.slice(0, -1)

          // keep popping while previous is also a shop
          while (history.length > 0 && history[history.length - 1].mode === 'shop') {
            history = history.slice(0, -1)
          }

          // safety: if we popped to nothing, go home
          if (history.length === 0) {
            return { history: [], panelMode: 'explore', panelContent: null }
          }

          const top = history[history.length - 1]
          return { history, panelMode: top.mode, panelContent: top.content }
        }),

      reset: root =>
        set(() => {
          const base = root ?? { mode: 'explore' as PanelMode, content: null }
          return { history: [base], panelMode: base.mode, panelContent: base.content, searchValue: '' }
        }),
    }),
    { name: 'PanelStore' },
  ),
)

export default usePanelStore
