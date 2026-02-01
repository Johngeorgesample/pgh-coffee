'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { ChevronRight } from 'lucide-react'
import AddListAction from './AddListAction'

interface ListSummary {
  id: string
  name: string
  photos: string[]
}

function PhotoAvatarStack({ photos, totalCount }: { photos: string[]; totalCount: number }) {
  const previews = photos.slice(0, 3)
  const overflow = totalCount - previews.length

  return (
    <div className="flex items-center">
      {previews.map((photo, i) => (
        <div
          key={i}
          className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shrink-0"
          style={{
            marginLeft: i === 0 ? 0 : '-8px',
            zIndex: previews.length - i,
          }}
        >
          <img src={photo} alt="" className="w-full h-full object-cover" />
        </div>
      ))}
      {overflow > 0 && (
        <div
          className="w-9 h-9 rounded-full bg-stone-100 border-2 border-white shrink-0 flex items-center justify-center text-[11px] font-semibold text-stone-400"
          style={{ marginLeft: '-8px' }}
        >
          +{overflow}
        </div>
      )}
    </div>
  )
}

function ListCard({ list }: { list: ListSummary }) {
  const photos = list.photos ?? []
  const photoCount = photos.length

  return (
    <Link
      href={`/account/lists/${list.id}`}
      className="group bg-white rounded-xl border border-stone-200 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg flex flex-col gap-4 no-underline"
    >
      <div className="min-w-0">
        <h3 className="text-base font-semibold text-stone-900 leading-snug truncate">{list.name}</h3>
        <div className="flex items-center gap-1 mt-1 text-stone-400 text-[13px]">
          <span>
            {photoCount} shop{photoCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {photos.length > 0 ? (
          <PhotoAvatarStack photos={photos} totalCount={photoCount} />
        ) : (
          <span className="text-xs text-stone-300">No shops yet</span>
        )}
        <div className="text-stone-300 group-hover:text-amber-600 transition-all duration-200 group-hover:translate-x-0.5">
          <ChevronRight />
        </div>
      </div>
    </Link>
  )
}

export default function ListsPage() {
  const [listItems, setListItems] = useState<ListSummary[]>([])

  useEffect(() => {
    fetch('/api/lists?photos')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch lists: ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        setListItems(Array.isArray(data) ? data : [])
      })
      .catch(error => {
        console.error('Failed to fetch lists:', error)
        setListItems([])
      })
  }, [])

  const totalShops = listItems.reduce((acc, list) => acc + (list.photos?.length ?? 0), 0)

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-stone-900">Lists</h1>
        {listItems.length > 0 && (
          <span className="text-[13px] text-stone-400">
            {listItems.length} list{listItems.length !== 1 ? 's' : ''} · {totalShops} shop{totalShops !== 1 ? 's' : ''}{' '}
            total
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {listItems.map(list => (
          <ListCard key={list.id} list={list} />
        ))}
        <AddListAction onAdd={newList => setListItems(prev => [...prev, { ...newList, photos: [] }])} />
      </div>

      {listItems.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">☕</div>
          <h2 className="text-lg font-semibold text-stone-900 mb-1">No lists yet</h2>
          <p className="text-sm text-stone-400">Create your first list to start organizing your favorite shops.</p>
        </div>
      )}
    </div>
  )
}
