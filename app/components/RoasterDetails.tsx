'use client'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { Instagram } from 'lucide-react'
import { useState, useEffect } from 'react'

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
}

export const RoasterDetails = ({ slug }: { slug: string }) => {
  const [roaster, setRoaster] = useState<TRoaster | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRoaster = async () => {
      try {
        const response = await fetch(`/api/roasters/${slug}`)
        const data = await response.json()
        setRoaster(data)
      } finally {
        setLoading(false)
      }
    }
    fetchRoaster()
  }, [slug])

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
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {roaster.website && (
              <a href={roaster.website} target="_blank" rel="noopener noreferrer">
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
      </div>
    </div>
  )
}
