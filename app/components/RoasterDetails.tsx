'use client'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { Flame, Instagram } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAnalytics } from '@/hooks'
import LocationList from '@/app/components/LocationList'
import useShopsStore from '@/stores/coffeeShopsStore'
import { formatDataToGeoJSON } from '../utils/utils'
import { DbShop } from '@/types/shop-types'

interface TRoaster {
  id: string
  name: string
  slug: string
  company_id: string | null
  logo: string | null
  website: string | null
  instagram: string | null
  description: string | null
  company?: {
    name: string
    slug: string
  }
  shops?: DbShop[]
}

export const RoasterDetails = ({ slug }: { slug: string }) => {
  const { setOverrideShops } = useShopsStore()
  const [roaster, setRoaster] = useState<TRoaster | null>(null)
  const [loading, setLoading] = useState(true)
  const plausible = useAnalytics()

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
    if (roaster?.shops && roaster.shops.length > 0) {
      setOverrideShops(formatDataToGeoJSON(roaster.shops))
    }
    return () => setOverrideShops(null)
  }, [roaster, setOverrideShops])

  if (loading) {
    return (
      <div className="flex h-full flex-col overflow-y-auto animate-pulse">
        <div className="h-56 sm:h-64 bg-gray-200 shrink-0" />
        <div className="px-6 lg:px-4 py-6 flex flex-col">
          <div className="flex gap-2 mb-4">
            <div className="h-8 w-24 bg-gray-200 rounded-full" />
            <div className="h-8 w-24 bg-gray-200 rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      </div>
    )
  }

  if (!roaster) return <p className="px-6 lg:px-4 mt-24 lg:mt-16">Roaster not found</p>

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="h-56 sm:h-64 relative bg-gradient-to-br from-stone-700 to-stone-900 shrink-0">
        {roaster.logo && (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <img
              src={roaster.logo}
              alt={`${roaster.name} logo`}
              className="max-h-28 max-w-[60%] object-contain rounded-2xl bg-white p-4 shadow-lg"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
          <span className="inline-flex items-center gap-1.5 bg-yellow-300 text-gray-950 px-2.5 py-1 rounded-full text-xs font-semibold mb-3">
            <Flame className="w-3.5 h-3.5" />
            Coffee roaster
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif tracking-tight leading-tight">{roaster.name}</h1>
          {roaster.company && (
            <div className="mt-1.5 text-sm text-white/85">
              Part of{' '}
              <Link href={`/companies/${roaster.company.slug}`} className="font-medium hover:underline">
                {roaster.company.name}
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 lg:px-4 py-6 flex flex-col">
        {(roaster.instagram || roaster.website) && (
          <div className="flex gap-2 mb-4">
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-sm hover:bg-gray-100 transition-colors"
              >
                <Instagram className="h-4 w-4" />
                Instagram
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-sm hover:bg-gray-100 transition-colors"
              >
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                Website
              </a>
            )}
          </div>
        )}

        {roaster.description && (
          <p className="text-sm text-gray-600 leading-relaxed">{roaster.description}</p>
        )}

        {roaster.shops && roaster.shops.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="mb-2 text-gray-700">Where to find this roaster&apos;s coffee</p>
            <LocationList coffeeShops={formatDataToGeoJSON(roaster.shops).features} />
          </div>
        )}
      </div>
    </div>
  )
}
