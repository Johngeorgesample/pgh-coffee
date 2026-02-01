'use client'

import { formatDBShopAsFeature } from '@/app/utils/utils'
import ShopList from '@/app/components/ShopList'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function ListDetailPage() {
  const params = useParams()
  const listId = params.listId as string

  const [listName, setListName] = useState<string>('')
  const [listItems, setListItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!listId) return

    Promise.all([
      fetch(`/api/lists/${listId}`).then(res => {
        if (!res.ok) throw new Error(`Failed to fetch list: ${res.status}`)
        return res.json()
      }),
      fetch(`/api/lists/${listId}/items`).then(res => {
        if (!res.ok) throw new Error(`Failed to fetch list items: ${res.status}`)
        return res.json()
      })
    ])
      .then(([listData, itemsData]) => {
        setListName(listData.name || '')
        setListItems(Array.isArray(itemsData) ? itemsData : [])
      })
      .catch(error => {
        console.error('Failed to fetch list data:', error)
        setListName('')
        setListItems([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [listId])

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <>
      <nav className="flex items-center gap-2 text-sm mb-4">
        <Link href="/account/lists" className="text-blue-600 hover:underline">
          Lists
        </Link>
        <span className="text-gray-400">&gt;</span>
        <span>{listName}</span>
      </nav>
      <h1 className="text-2xl font-bold mb-4">{listName}</h1>
      <ShopList coffeeShops={listItems.map(item => formatDBShopAsFeature(item.shop))} />
    </>
  )
}
