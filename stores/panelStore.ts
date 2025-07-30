import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { ReactNode } from 'react'

interface PanelState {
  searchValue: string
  panelContent: ReactNode
  setSearchValue: (value: string) => void
  setPanelContent: (content: ReactNode) => void
}

const usePanelStore = create<PanelState>()(
  devtools(
    (set) => ({
      searchValue: '',
      panelContent: null,
      
      setSearchValue: (value: string) => set({ searchValue: value }),
      setPanelContent: (content: ReactNode) => set({ panelContent: content }),
    }),
    { name: 'PanelStore' }
  )
)

export default usePanelStore