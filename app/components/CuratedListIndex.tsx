'use client'

import usePanelStore from '@/stores/panelStore'
import { curatedLists } from '@/data/lists/curatedLists'
import { CuratedList } from './CuratedList'

interface IProps {}

export const CuratedListIndex = (props: IProps) => {
  const { setPanelContent } = usePanelStore()

  return (
    <div className="mt-20 px-4 sm:px-6">
      <div className="flex flex-col divide-y border rounded-md bg-white shadow-sm">
        {curatedLists.map((list) => (
          <button
            key={list.id}
            onClick={() => setPanelContent(<CuratedList content={list} />, 'list')}
            className="text-left p-4 hover:bg-gray-50 transition"
          >
            <div className="font-semibold text-gray-900">{list.title}</div>
            <div className="text-sm text-gray-600">{list.description}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
