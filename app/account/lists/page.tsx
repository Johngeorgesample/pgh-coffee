'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import CreateListButton from '../../components/CreateListButton'

export default function ListsPage() {
  const [listItems, setListItems] = useState([])

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

  return (
    <>
      <p>Lists</p>
      <div className="flex flex-col gap-2">
        {listItems.map(list => {
          return (
            <Link key={list.id} href={`/account/lists/${list.id}`} className="border border-solid p-2">
              <p>{list.name}</p>
            </Link>
          )
        })}

          <div className="border-t -mx-6 px-6 pt-4">
            <CreateListButton onAdd={() => console.log('create list')} />
          </div>
      </div>
    </>
  )
}
