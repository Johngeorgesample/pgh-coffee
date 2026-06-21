'use client'

import { ArrowTopRightOnSquareIcon, BuildingStorefrontIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { Instagram } from 'lucide-react'
import LocationList from '@/app/components/LocationList'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useShopsStore from '@/stores/coffeeShopsStore'
import { useAnalytics } from '@/hooks'
import { formatDataToGeoJSON } from '../utils/utils'
import { TCompany, TShop } from '@/types/shop-types'

const groupByNeighborhood = (features: TShop[]): [string, TShop[]][] => {
  const groups = new Map<string, TShop[]>()
  for (const feature of features) {
    const neighborhood = feature.properties.neighborhood
    const group = groups.get(neighborhood)
    if (group) {
      group.push(feature)
    } else {
      groups.set(neighborhood, [feature])
    }
  }
  return Array.from(groups.entries()).sort(
    (a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0])
  )
}

export const Company = ({ slug }: { slug: string }) => {
  const { setOverrideShops, setSearchValue } = useShopsStore()
  const plausible = useAnalytics()
  const router = useRouter()
  const [company, setCompany] = useState<TCompany | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setCompany(null)
    setLoading(true)
    const fetchCompany = async () => {
      try {
        const response = await fetch(`/api/companies/${slug}`)
        const data = await response.json()
        setCompany(data)
      } finally {
        setLoading(false)
      }
    }
    fetchCompany()
  }, [slug])

  useEffect(() => {
    if (company?.shops) {
      const shopsGeoJSON = formatDataToGeoJSON(company.shops)
      setOverrideShops(shopsGeoJSON)
    }
    return () => setOverrideShops(null)
  }, [company, setOverrideShops])

  const handleNeighborhoodClick = (neighborhood: string) => {
    plausible('NeighborhoodClick', { props: { neighborhood, company: company?.slug } })
    // Leave the /companies/{slug} route through the App Router so usePathname
    // updates; setSearchValue then drives the search panel for the neighborhood.
    router.push(`/?neighborhood=${encodeURIComponent(neighborhood)}`)
    setSearchValue(neighborhood)
  }

  if (loading) {
    return (
      <div className="flex h-full flex-col overflow-y-auto animate-pulse">
        <div className="h-56 sm:h-64 bg-gray-200 shrink-0" />
        <div className="px-6 lg:px-4 py-6 flex flex-col">
          <div className="flex gap-2 mb-4">
            <div className="h-8 w-24 bg-gray-200 rounded-full" />
            <div className="h-8 w-24 bg-gray-200 rounded-full" />
          </div>
          <div className="space-y-2 mb-6">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }
  if (!company) return <p>Company not found</p>

  const { features } = formatDataToGeoJSON(company.shops || [])
  const heroPhoto = features.find(f => f.properties.photo)?.properties.photo
  const locationCount = features.length
  const neighborhoodCount = new Set(features.map(f => f.properties.neighborhood)).size
  const grouped = groupByNeighborhood(features)

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div
        className="h-56 sm:h-64 relative bg-stone-300 bg-cover bg-center shrink-0"
        style={heroPhoto ? { backgroundImage: `url('${heroPhoto}')` } : undefined}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
          <span className="inline-flex items-center gap-1.5 bg-yellow-300 text-gray-950 px-2.5 py-1 rounded-full text-xs font-semibold mb-3">
            <BuildingStorefrontIcon className="w-3.5 h-3.5" />
            Coffee company
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif tracking-tight leading-tight">{company.name}</h1>
          <div className="flex items-center gap-2 mt-1.5 text-sm text-white/85">
            <span>
              {locationCount} {locationCount === 1 ? 'location' : 'locations'}
            </span>
            <span className="opacity-50">·</span>
            <span>
              {neighborhoodCount} {neighborhoodCount === 1 ? 'neighborhood' : 'neighborhoods'}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 lg:px-4 py-6 flex flex-col">
        {(company.instagram_handle || company.website) && (
          <div className="flex gap-2 mb-4">
            {company.instagram_handle && (
              <a
                href={`https://www.instagram.com/${company.instagram_handle}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-sm hover:bg-gray-100 transition-colors"
              >
                <Instagram className="h-4 w-4" />
                Instagram
              </a>
            )}
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-sm hover:bg-gray-100 transition-colors"
              >
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                Website
              </a>
            )}
          </div>
        )}

        {company.description && (
          <p className="text-sm text-gray-600 leading-relaxed">{company.description}</p>
        )}

        <div className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Locations</h2>
          {grouped.map(([neighborhood, shops]) => (
            <div key={neighborhood}>
              <button
                type="button"
                onClick={() => handleNeighborhoodClick(neighborhood)}
                aria-label={`Show all shops in ${neighborhood}`}
                className="group flex items-center gap-1.5 mt-4 text-gray-900 hover:text-gray-950"
              >
                <h3 className="text-sm font-medium group-hover:underline">{neighborhood}</h3>
              </button>
              <LocationList coffeeShops={shops} hideShopNames={true} showAddresses={true} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
