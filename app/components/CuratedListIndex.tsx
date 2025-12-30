'use client'

import { useEffect, useState } from 'react'
import { usePlausible } from 'next-plausible'
import usePanelStore from '@/stores/panelStore'
import { CuratedList } from './CuratedList'
import {TList} from '@/types/shop-types'

export const CuratedListIndex = () => {
  const { setPanelContent } = usePanelStore()
  const [lists, setLists] = useState<TList[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const plausible = usePlausible()

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const res = await fetch('/api/curated-lists')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: TList[] = await res.json()
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

  const handleClick = (list: TList) => {
    setPanelContent(<CuratedList content={list} />, 'list')
    plausible('CuratedListClick', {
      props: {
        listName: list.title
      },
    })
  }

  if (loading) return <div className="mt-20 px-4 sm:px-6">Loading...</div>
  if (error) return <div className="mt-20 px-4 sm:px-6">{error}</div>

  return (
    <div className="mt-4">
      <div className="flex flex-col divide-y">
        <div className="grid grid-cols-2 gap-2">
          {lists.map(list => (
            <button
              key={list.id}
              onClick={() => handleClick(list)}
              className="relative h-21 rounded-xl overflow-hidden group bg-zinc-900"
            >
              <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,208,0,.18),rgba(0,0,0,.35))]" />

              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,.02)_0_6px,rgba(0,0,0,.02)_6px_12px)] saturate-110 contrast-105" />

              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

              <div className="relative z-10 flex h-full flex-col justify-end p-4 text-left text-white">
                <div className="w-fit mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/70 px-2.5 py-1 text-[12px] backdrop-blur-sm">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#ffd400] shadow-[0_0_0_2px_rgba(255,212,0,.15)]" />
                  {list.shops.length}
                </div>
                <span className="text-[18px] font-extrabold drop-shadow-sm">{list.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
