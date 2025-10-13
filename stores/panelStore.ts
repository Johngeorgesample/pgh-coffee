import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { ReactNode } from 'react'

interface PanelState {
  mode: string
  content: ReactNode
  setPanel: (mode: string, content: ReactNode) => void
}

export const usePanelStore = create<PanelState>()(
  devtools(
    (set, get) => ({
      mode: '',
      content: null,
      setPanel: (mode: string, content: ReactNode) => set({ mode, content }),
    }),
    { name: 'PanelStore' },
  ),
)
