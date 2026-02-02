'use client'

import { formatDBShopAsFeature, fmtISO } from '@/app/utils/utils'
import ShopList from '@/app/components/ShopList'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ListActions from './ListActions'
import { DbShop } from '@/types/shop-types'

interface ListItem {
  id: string
  created_at: string
  shop: DbShop
}

interface List {
  id: string
  name: string
  user_id: string
  created_at: string
  is_public: boolean
  items: ListItem[]
}

function ListDetailSkeleton() {
  return (
    <>
      <nav className="flex items-center gap-2 text-sm mb-4">
        <div className="h-4 bg-stone-200 rounded w-10 animate-pulse" />
        <span className="text-gray-400">&gt;</span>
        <div className="h-4 bg-stone-200 rounded w-24 animate-pulse" />
      </nav>
      <div className="flex items-center mb-2">
        <div className="h-8 bg-stone-200 rounded w-48 flex-1 animate-pulse" />
        <div className="h-8 bg-stone-100 rounded w-24 animate-pulse" />
      </div>
      <div className="h-4 bg-stone-100 rounded w-40 mb-6 animate-pulse" />
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl border border-stone-200 p-4 animate-pulse">
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-stone-200 rounded-lg shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="h-5 bg-stone-200 rounded w-40 mb-2" />
                <div className="h-4 bg-stone-100 rounded w-28 mb-1" />
                <div className="h-4 bg-stone-100 rounded w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default function ListDetailPage() {
  const params = useParams()
  const listId = params.listId as string

  const [list, setList] = useState<List | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!listId) return

    fetch(`/api/lists/${listId}`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch list: ${res.status}`)
        return res.json()
      })
      .then(data => {
        setList(data)
      })
      .catch(error => {
        console.error('Failed to fetch list data:', error)
        setList(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [listId])

  if (loading) {
    return <ListDetailSkeleton />
  }

  if (!list) {
    return <p>List not found</p>
  }

  return (
    <>
      <nav className="flex items-center gap-2 text-sm mb-4">
        <Link href="/account/lists" className="text-blue-600 hover:underline">
          Lists
        </Link>
        <span className="text-gray-400">&gt;</span>
        <span>{list.name}</span>
      </nav>
      <div className="flex items-center">
        <h1 className="text-2xl flex-1 font-bold">{list.name}</h1>
        <ListActions
          listId={list.id}
          listName={list.name}
          isPublic={list.is_public}
          onNameUpdate={newName => setList({ ...list, name: newName })}
          onPublicChange={isPublic => setList({ ...list, is_public: isPublic })}
        />
      </div>
      <p>
        {list.items.length} shops · Created {fmtISO(list.created_at)}
      </p>
      <ShopList coffeeShops={list.items.map(item => formatDBShopAsFeature(item.shop))} />
    </>
  )
}
