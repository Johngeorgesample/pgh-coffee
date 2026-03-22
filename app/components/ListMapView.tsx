'use client'

import { useEffect, useState } from 'react'
import useShopsStore from '@/stores/coffeeShopsStore'
import usePanelStore from '@/stores/panelStore'
import LocationList from '@/app/components/LocationList'
import { formatDBShopAsFeature } from '@/app/utils/utils'
import { DbShop, TFeatureCollection } from '@/types/shop-types'
import EditListAction from '@/app/account/lists/EditListAction'
import ShareListAction from '@/app/account/lists/ShareListAction'
import DeleteListAction from '@/app/account/lists/DeleteListAction'

interface ListItem {
  id: string
  shop: DbShop
}

interface List {
  id: string
  name: string
  description: string | null
  is_public: boolean
  isOwner: boolean
  items: ListItem[]
}

export const ListMapView = ({ listId }: { listId: string }) => {
  const { setOverrideShops } = useShopsStore()
  const [list, setList] = useState<List | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setList(null)
    setLoading(true)
    fetch(`/api/lists/${listId}`)
      .then(res => {
        if (!res.ok) throw new Error('List not found')
        return res.json()
      })
      .then(data => setList(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [listId])

  useEffect(() => {
    if (list?.items) {
      const shopsGeoJSON: TFeatureCollection = {
        type: 'FeatureCollection',
        features: list.items.map(item => formatDBShopAsFeature(item.shop)),
      }
      setOverrideShops(shopsGeoJSON)
    }
    return () => {
      if (usePanelStore.getState().panelMode !== 'shop') {
        setOverrideShops(null)
      }
    }
  }, [list, setOverrideShops])

  if (loading) {
    return (
      <div className="px-6 lg:px-4 mt-24 lg:mt-16 flex flex-col animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    )
  }

  if (!list) return <p className="px-6 lg:px-4 mt-24">List not found</p>

  const shops = list.items.map(item => formatDBShopAsFeature(item.shop))

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="px-6 lg:px-4 mt-20 lg:mt-16 flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="font-medium text-2xl flex-1">{list.name}</h2>
          {list.isOwner && (
            <div className="flex items-center gap-1 shrink-0">
              <ShareListAction
                listId={list.id}
                isPublic={list.is_public}
                onPublicChange={isPublic => setList({ ...list, is_public: isPublic })}
              />
              <EditListAction
                listId={list.id}
                currentName={list.name}
                currentDescription={list.description}
                onUpdate={(name, description) => setList({ ...list, name, description })}
              />
              <DeleteListAction listId={list.id} listName={list.name} />
            </div>
          )}
        </div>
        {list.description && (
          <p className="text-sm text-gray-500 mb-1">{list.description}</p>
        )}
        <p className="text-sm text-gray-400 mb-2">{list.items.length} shops</p>
        <LocationList coffeeShops={shops} />
      </div>
    </div>
  )
}
