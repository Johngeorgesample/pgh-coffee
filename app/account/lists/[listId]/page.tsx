'use client'

import { formatDBShopAsFeature, fmtISO } from '@/app/utils/utils'
import ShopList from '@/app/components/ShopList'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ListActions from './ListActions'

interface ListItem {
  id: string
  created_at: string
  shop: Record<string, unknown>
}

interface List {
  id: string
  name: string
  user_id: string
  created_at: string
  items: ListItem[]
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
    return <p>Loading...</p>
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
          onNameUpdate={newName => setList({ ...list, name: newName })}
        />
      </div>
      <p>
        {list.items.length} shops · Created {fmtISO(list.created_at)}
      </p>
      <ShopList coffeeShops={list.items.map(item => formatDBShopAsFeature(item.shop))} />
    </>
  )
}
