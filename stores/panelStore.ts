import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { ReactNode } from 'react'

type PanelMode = 'explore' | 'search' | 'shop' | 'list' | null

interface PanelState {
  panelMode: PanelMode
  searchValue: string
  panelContent: ReactNode
  setSearchValue: (value: string) => void
  setPanelContent: (content: ReactNode, mode: PanelMode) => void
}

const usePanelStore = create<PanelState>()(
  devtools(
    (set) => ({
      panelMode: null,
      searchValue: '',
      panelContent: null,

      setSearchValue: (value: string) => set({ searchValue: value }),

      setPanelContent: (content: ReactNode, mode: PanelMode) =>
        set({
          panelContent: content,
          panelMode: mode,
        }),
    }),
    { name: 'PanelStore' }
  )
)

export default usePanelStore
