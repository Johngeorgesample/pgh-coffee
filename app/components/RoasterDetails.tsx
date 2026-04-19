'use client'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { Instagram } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAnalytics } from '@/hooks'
import useShopsStore from '@/stores/coffeeShopsStore'
import { useShopSelection } from '@/hooks'

interface RoasterShop {
  name: string
  neighborhood: string
  photo: string | null
  uuid: string
}

interface TRoaster {
  id: string
  name: string
  slug: string
  company_id: string | null
  logo: string | null
  website: string | null
  instagram: string | null
  description: string | null
  shops: RoasterShop[]
  company?: {
    name: string
    slug: string
  }
}

export const RoasterDetails = ({ slug }: { slug: string }) => {
  const [roaster, setRoaster] = useState<TRoaster | null>(null)
  const [loading, setLoading] = useState(true)
  const plausible = useAnalytics()
  const { allShops } = useShopsStore()
  const { handleShopSelect } = useShopSelection()

  useEffect(() => {
    const fetchRoaster = async () => {
      try {
        const response = await fetch(`/api/roasters/${slug}`)
        const data = await response.json()
        setRoaster(data)
        plausible('RoasterView', {
          props: { roasterName: data.name, roasterSlug: slug },
        })
      } finally {
        setLoading(false)
      }
    }
    fetchRoaster()
  }, [slug, plausible])

  useEffect(() => {
    if (roaster?.slug) {
      const url = new URL(window.location.href)
      const params = new URLSearchParams(url.search)
      params.delete('shop')
      params.delete('company')
      params.set('roaster', roaster.slug)
      url.search = params.toString()
      window.history.pushState(null, '', url.toString())
    }
  }, [roaster])

  if (loading) {
    return (
      <div className="px-6 lg:px-4 mt-24 lg:mt-16 flex flex-col animate-pulse">
        <div className="flex items-center justify-between mb-2">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="flex gap-2">
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (!roaster) return <p className="px-6 lg:px-4 mt-24 lg:mt-16">Roaster not found</p>

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="px-6 lg:px-4 mt-20 lg:mt-16 flex flex-col">
        {roaster.logo && (
          <div className="mb-4">
            <img
              src={roaster.logo}
              alt={`${roaster.name} logo`}
              className="h-24 w-24 object-contain"
            />
          </div>
        )}

        <div className="flex items-center justify-between mb-2">
          <h2 className="font-medium text-2xl">{roaster.name}</h2>

          <div className="flex gap-2">
            {roaster.instagram && (
              <a
                href={`https://www.instagram.com/${roaster.instagram}/`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  plausible('RoasterInstagramClick', {
                    props: { roasterName: roaster.name, roasterSlug: roaster.slug },
                  })
                }
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {roaster.website && (
              <a
                href={roaster.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  plausible('RoasterWebsiteClick', {
                    props: { roasterName: roaster.name, roasterSlug: roaster.slug },
                  })
                }
              >
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {roaster.description && (
          <p className="text-sm text-gray-600 mb-4">{roaster.description}</p>
        )}

        {roaster.company && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Part of <span className="font-medium">{roaster.company.name}</span>
            </p>
          </div>
        )}

        {roaster.shops?.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-3">Where to find it</p>
            <ul className="space-y-2">
              {roaster.shops.map((shop) => {
                const match = allShops?.features?.find(
                  f => f.properties.uuid === shop.uuid
                )
                return (
                  <li key={shop.uuid}>
                    <button
                      className="text-left text-sm text-stone-700 hover:text-amber-700 transition-colors"
                      onClick={() => match && handleShopSelect(match)}
                    >
                      {shop.name}
                      <span className="ml-1 text-stone-400">{shop.neighborhood}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
