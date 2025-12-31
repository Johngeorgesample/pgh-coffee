'use client'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { Instagram } from 'lucide-react'
import ShopList from '@/app/components/ShopList'
import { useState, useEffect } from 'react'
import useShopsStore from '@/stores/coffeeShopsStore'
import { formatDataToGeoJSON } from '../utils/utils'

export const Company = ({ slug }: { slug: string }) => {
  const { allShops, setCurrentShop, setDisplayedShops } = useShopsStore()
  const [company, setCompany] = useState<any>(null)
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
    if (company?.shops) {
      const shopsGeoJSON = formatDataToGeoJSON(company.shops)
      setDisplayedShops(shopsGeoJSON)
    }
  }, [company, setDisplayedShops])

  if (loading) return <p>Loading...</p>
  if (!company) return <p>Company not found</p>

  const shopsGeoJSON = formatDataToGeoJSON(company.shops)

  return (
    <div className="px-6 lg:px-4 mt-24 lg:mt-16 flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-2xl">{company.name}</h2>

        <div className="flex gap-2">
          <a href={`https://www.instagram.com/${company.instagram_handle}/`} target="_blank" className="">
            <Instagram className="h-4 w-4" />
          </a>
          <a href={company.website} target="_blank">
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
      <p className="text-sm text-gray-600">{company.description}</p>
      <p>{company.shops?.length || 0} shops</p>
      <ShopList coffeeShops={shopsGeoJSON.features} hideShopNames={true} />
    </div>
  )
}
