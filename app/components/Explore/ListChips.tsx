import { useEffect, useState } from 'react'
import usePanelStore from '@/stores/panelStore'
import { CuratedList } from '../CuratedList'

type CuratedListType = {
  id: string
  title: string
  description: string
  header?: string
  featured: boolean
  created_by: string
  created_at: string
  updated_at: string
}

export const ListChips = () => {
  const { setPanelContent } = usePanelStore()

  const [lists, setLists] = useState<CuratedListType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const res = await fetch('/api/curated-lists')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: CuratedListType[] = await res.json()
        setLists(data)
      } catch (err) {
        console.error('Error fetching curated lists:', err)
        setError('Failed to load curated lists')
      } finally {
        setLoading(false)
      }
    }

    fetchLists()
  }, [])

  return (
    <>
      {/* Curated lists (chips instead of just one box) */}
      <div className="col-span-2">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-neutral-800">Curated Lists</h3>
          <a href="#" className="text-xs text-blue-600 hover:underline">
            Browse all
          </a>
        </div>
        <div className="flex flex-wrap gap-2">
          {lists.map(list => (
            <button
              key={list.id}
              className="px-3 py-1 rounded-full bg-neutral-200 hover:bg-neutral-300 text-xs text-neutral-700"
              onClick={() => setPanelContent(<CuratedList content={list} />, 'list')}
            >
              {list.title}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
