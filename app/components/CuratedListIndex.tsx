'use client'

import usePanelStore from '@/stores/panelStore'
import { curatedLists } from '@/data/lists/curatedLists'
import { CuratedList } from './CuratedList'

interface IProps {}

export const CuratedListIndex = (props: IProps) => {
  const { searchValue, setSearchValue, panelContent, setPanelContent } = usePanelStore()

  return (
    <div className="mt-20">
      {curatedLists.map(list => {
        return (
          <button key={list.id} className='block' onClick={() => setPanelContent(<CuratedList content={list}/>)}>
            {list.title}
          </button>
        )
      })}
    </div>
  )
}
