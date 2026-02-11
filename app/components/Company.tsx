'use client'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { Instagram } from 'lucide-react'
import LocationList from '@/app/components/LocationList'
import { useState, useEffect } from 'react'
import useShopsStore from '@/stores/coffeeShopsStore'
import { formatDataToGeoJSON } from '../utils/utils'
import { TCompany } from '@/types/shop-types'

export const Company = ({ slug }: { slug: string }) => {
  const { setOverrideShops } = useShopsStore()
  const [company, setCompany] = useState<TCompany | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
    if (company?.slug) {
      const url = new URL(window.location.href)
      const params = new URLSearchParams(url.search)
      params.delete('shop')
      params.set('company', company.slug)
      url.search = params.toString()
      window.history.pushState(null, '', url.toString())
    }
  }, [company])

  useEffect(() => {
    if (company?.shops) {
      const shopsGeoJSON = formatDataToGeoJSON(company.shops)
      setOverrideShops(shopsGeoJSON)
    }
    return () => setOverrideShops(null)
  }, [company, setOverrideShops])

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
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }
  if (!company) return <p>Company not found</p>

  const shopsGeoJSON = formatDataToGeoJSON(company.shops || [])

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="px-6 lg:px-4 mt-20 lg:mt-16 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-medium text-2xl">{company.name}</h2>

          <div className="flex gap-2">
            <a
              href={`https://www.instagram.com/${company.instagram_handle}/`}
              target="_blank"
              rel="noopener noreferrer"
              className=""
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a href={company.website} target="_blank" rel="noopener noreferrer">
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
        <p className="text-sm text-gray-600">{company.description}</p>
        <LocationList coffeeShops={shopsGeoJSON.features} hideShopNames={true} />
      </div>
    </div>
  )
}
