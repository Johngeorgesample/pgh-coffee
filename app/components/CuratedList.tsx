'use client'

import { useEffect, useState } from 'react'
import ShopList from './ShopList'

interface IProps {
  content: any
}

export const CuratedList = (props: IProps) => {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchShops = async () => {
      if (!props.content.shopIds || props.content.shopIds.length === 0) {
        setLoading(false)
        return
      }

      try {
        const idsParam = props.content.shopIds.join(',')
        const response = await fetch(`/api/shops/batch?ids=${idsParam}`)

        if (!response.ok) {
          throw new Error('Failed to fetch shops')
        }

        const data = await response.json()
        setShops(data.features)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchShops()
  }, [props.content.shopIds])

  if (loading) {
    return (
      <div className="mt-20">
        <div>{props.content.title}</div>
        <div>{props.content.description}</div>
        <div>Loading shops...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-20">
        <div>{props.content.title}</div>
        <div>{props.content.description}</div>
        <div>Error: {error}</div>
      </div>
    )
  }

  console.log(shops)

  return (
    <div className="mt-20">
      <div className="flex h-full flex-col overflow-y-auto px-4 sm:px-6">
        <div>{props.content.title}</div>
        <div>{props.content.description}</div>
        <hr />
        {shops.length > 0 ? <ShopList coffeeShops={shops} handleCardClick={() => {}} /> : <div>No shops found</div>}
      </div>
    </div>
  )
}
