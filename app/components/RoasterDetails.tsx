'use client'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { Flame, Instagram } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAnalytics } from '@/hooks'
import LocationList from '@/app/components/LocationList'
import RoasterSkeleton from '@/app/components/RoasterSkeleton'
import VerifiedBadge from '@/app/components/VerifiedBadge'
import ClaimButton from '@/app/components/ClaimButton'
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
  is_verified?: boolean
  company?: {
    name: string
    slug: string
  }
  shops?: DbShop[]
}

async function fetchRoaster(slug: string, signal: AbortSignal) {
  const res = await fetch(`/api/roasters/${slug}`, { signal })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<TRoaster>
}

export const RoasterDetails = ({ slug }: { slug: string }) => {
  const setOverrideShops = useShopsStore(s => s.setOverrideShops)
  const [roaster, setRoaster] = useState<TRoaster | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading')
  const plausible = useAnalytics()

  useEffect(() => {
    setRoaster(null)
    setStatus('loading')

    const controller = new AbortController()
    fetchRoaster(slug, controller.signal)
      .then(data => {
        if (controller.signal.aborted) return
        setRoaster(data)
        setStatus('ready')
        if (data) plausible('RoasterView', { props: { roasterName: data.name, roasterSlug: slug } })
      })
      .catch(err => {
        if (err.name === 'AbortError') return
        console.error('Error fetching roaster:', err)
        setStatus('failed')
      })

    return () => controller.abort()
  }, [slug, plausible])

  useEffect(() => {
    if (roaster?.shops && roaster.shops.length > 0) {
      setOverrideShops(formatDataToGeoJSON(roaster.shops))
    }
    return () => setOverrideShops(null)
  }, [roaster, setOverrideShops])

  if (status === 'loading') return <RoasterSkeleton />
  if (status === 'failed') {
    return (
      <p className="px-6 lg:px-4 mt-24 lg:mt-16">
        Couldn&apos;t load this roaster. Try again in a moment.
      </p>
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
          <h1 className="flex items-center gap-1.5 text-3xl sm:text-4xl font-serif tracking-tight leading-tight">
            {roaster.name}
            {roaster.is_verified && <VerifiedBadge className="mt-1" />}
          </h1>
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

        {!roaster.is_verified && (
          <div className="mt-5 flex items-center justify-between gap-3">
            <p className="text-sm text-gray-500">Run {roaster.name}?</p>
            <ClaimButton href={`/claim?roaster=${slug}`} label="Claim this roaster" />
          </div>
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
