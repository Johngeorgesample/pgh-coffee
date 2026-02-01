'use client'

import { formatDBShopAsFeature, formatDataToGeoJSON } from '@/app/utils/utils'
import ShopList from '@/app/components/ShopList'
import { useEffect, useState } from 'react'

export default function ListsPage() {
  const [listItems, setListItems] = useState([])
  const [selectedList, setSelectedList] = useState([])

  useEffect(() => {
    fetch('/api/lists')
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
        console.error('Failed to fetch favorites:', error)
        setListItems([])
      })
  }, [])

  const hydrateList = (listID: string) => {
    fetch(`/api/lists/${listID}/items`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch shops in list: ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        setSelectedList(Array.isArray(data) ? data : [])
      })
      .catch(error => {
        console.error('Failed to fetch:', error)
        setSelectedList([])
      })
  }

  return (
    <>
      <p>Lists</p>
      <div className="flex flex-col gap-2">
        {listItems.map(list => {
          return (
            <button key={list.id} className="border border-solid" onClick={() => hydrateList(list.id)}>
              <p>{list.name}</p>
            </button>
          )
        })}
      </div>
      <div>
        <ShopList coffeeShops={selectedList.map(item => formatDBShopAsFeature(item.shop))} />
      </div>
    </>
  )
}
