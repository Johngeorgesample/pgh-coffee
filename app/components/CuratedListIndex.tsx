'use client'

import { useEffect, useState } from 'react'
import usePanelStore from '@/stores/panelStore'
import { CuratedList } from './CuratedList'

interface IProps {}

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

export const CuratedListIndex = (props: IProps) => {
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

  if (loading) return <div className="mt-20 px-4 sm:px-6">Loading...</div>
  if (error) return <div className="mt-20 px-4 sm:px-6">{error}</div>

console.log(lists)

  return (
    <div className="mt-20 px-4 sm:px-6">
      <div className="flex flex-col divide-y">
        <div className="grid gap-2">
          {lists.map(list => (
            <button
              key={list.id}
              onClick={() => setPanelContent(<CuratedList content={list} />, 'list')}
              className="relative h-40 rounded-xl overflow-hidden group"
            >
              <img
                src={list.header}
                alt=""
                className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <div className="relative z-10 p-4 text-white">
                <span className="text-sm font-medium">{list.title}</span>
                <span className="block text-lg font-bold">{list.description}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
