import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { ReactNode } from 'react'

interface SearchState {
  searchValue: string

  setSearchValue: (value: string) => void
}

const useSearchStore = create<SearchState>()(
  devtools(
    (set, get) => ({
      searchValue: '',
      history: [],

      setSearchValue: value => set({ searchValue: value }),
    }),
    { name: 'PanelStore' },
  ),
)

export default useSearchStore
