import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { ReactNode } from 'react'

interface PanelEntry {
  mode: string
  content: any
  metadata?: Record<string, any>
}

interface PanelState {
  current: PanelEntry
  history: PanelEntry[]
  setPanel: (mode: string, content: ReactNode, metadata?: Record<string, any>) => void
  goBack: () => void
  canGoBack: () => boolean
  clearHistory: () => void
}

const DEFAULT_PANEL: PanelEntry = {
  mode: 'explore',
  content: null,
}

export const usePanelStore = create<PanelState>()(
  devtools(
    (set, get) => ({
      current: DEFAULT_PANEL,
      history: [],
      
      setPanel: (mode, content, metadata) => {
        const { current } = get()
        set({
          current: { mode, content, metadata },
          history: [...get().history, current],
        })
      },
      
      goBack: () => {
        const { history } = get()
        if (history.length === 0) return
        
        const previous = history[history.length - 1]
        const newHistory = history.slice(0, -1)
        
        set({
          current: previous,
          history: newHistory,
        })
      },
      
      canGoBack: () => get().history.length > 0,
      
      clearHistory: () => set({ history: [], current: DEFAULT_PANEL }),
    }),
    { name: 'PanelStore' },
  ),
)
