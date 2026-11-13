'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart, MapPin } from 'lucide-react'
import EmptyCard from './EmptyCard'
import ShopCard from '@/app/components/ShopCard'
import { formatDBShopAsFeature } from '@/app/utils/utils'
import type { DbShop } from '@/types/shop-types'

interface Favorite {
  id: string
  created_at: string
  shop: DbShop
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const hasFavorites = favorites && favorites.length > 0

  useEffect(() => {
    fetch('/api/favorites')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch favorites: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        setFavorites(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch favorites:', err)
        setError(true)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading...</div>

  if (error) {
    return (
      <EmptyCard icon={Heart} title="Couldn't load your favorites" body="Something went wrong while loading your favorites. Please try refreshing the page." />
    )
  }

  return (
    <div>
      {hasFavorites ? (
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Favorites</h1>
            <p className="text-gray-500">The coffee shops you&apos;ve saved.</p>
          </div>
          <ul>
            {favorites.map((fav) => (
              <ShopCard key={fav.id} shop={formatDBShopAsFeature(fav.shop)} />
            ))}
          </ul>
        </div>
      ) : (
        <EmptyCard icon={Heart} title="No favorites yet" body="Start exploring coffee shops and save your favorites to see them here.">
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-lg py-3 px-4 text-sm font-semibold text-black bg-yellow-300 hover:bg-yellow-400"
          >
            <MapPin className="h-4 w-4" />
            Explore shops
          </Link>
        </EmptyCard>
      )}
    </div>
  )
}
