'use client'

import { formatDBShopAsFeature, fmtISO } from '@/app/utils/utils'
import ShopList from '@/app/components/ShopList'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

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
  is_public: boolean
  items: ListItem[]
  isOwner: boolean
}

export default function PublicListPage() {
  const params = useParams()
  const listId = params.listId as string

  const [list, setList] = useState<List | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!listId) return

    fetch(`/api/lists/${listId}`)
      .then(res => {
        if (res.status === 401) {
          throw new Error('This list is private')
        }
        if (res.status === 404) {
          throw new Error('List not found')
        }
        if (!res.ok) {
          throw new Error('Failed to load list')
        }
        return res.json()
      })
      .then(data => {
        setList(data)
      })
      .catch(err => {
        console.error('Failed to fetch list data:', err)
        setError(err.message)
        setList(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [listId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
        <p>Loading...</p>
      </div>
    )
  }

  if (error || !list) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
        <p className="text-stone-600">{error || 'List not found'}</p>
        <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to map
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <nav className="flex items-center gap-2 text-sm mb-4">
          <Link href="/" className="text-blue-600 hover:underline">
            Home
          </Link>
          <span className="text-gray-400">&gt;</span>
          <span>{list.name}</span>
        </nav>
        <h1 className="text-2xl font-bold">{list.name}</h1>
        <p className="text-stone-600">
          {list.items.length} shops · Created {fmtISO(list.created_at)}
        </p>
        {list.isOwner && (
          <Link
            href={`/account/lists/${list.id}`}
            className="text-blue-600 hover:underline text-sm mt-2 inline-block"
          >
            Edit this list
          </Link>
        )}
        <ShopList coffeeShops={list.items.map(item => formatDBShopAsFeature(item.shop))} />
      </div>
    </div>
  )
}
