'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart, MapPin } from 'lucide-react'
import ShopCard from '@/app/components/ShopCard'
import { formatDBShopAsFeature } from '@/app/utils/utils'

export default function Favorites() {
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const hasFavorites = favorites && favorites.length > 0

  useEffect(() => {
    fetch('/api/favorites')
      .then((res) => res.json())
      .then((data) => {
        setFavorites(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setFavorites([])
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading...</div>
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Favorites</h1>

      {hasFavorites ? (
        <ul>
          {favorites.map((fav) => (
            <ShopCard key={fav.id} shop={formatDBShopAsFeature(fav.shop)} />
          ))}
        </ul>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Heart className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-500 max-w-sm">
              Start exploring coffee shops and save your favorites to see them here.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-lg py-3 px-4 text-sm font-semibold text-black bg-yellow-300 hover:bg-yellow-400"
            >
              <MapPin className="h-4 w-4" />
              Explore shops
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
