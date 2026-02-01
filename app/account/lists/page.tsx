'use client'

import { useEffect, useState } from 'react'

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
      <pre>{JSON.stringify(listItems, null, 2)}</pre>
    </>
  )
}
