'use client'
import ShopList from '@/app/components/ShopList'

import { useState, useEffect } from 'react'
import { formatDataToGeoJSON } from '../utils/utils'

export const Company = ({ slug }: { slug: string }) => {
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

  if (loading) return <p>Loading...</p>
  if (!company) return <p>Company not found</p>

  const shopsGeoJSON = formatDataToGeoJSON(company.shops)

  return (
    <div className="px-6 lg:px-4 mt-24 lg:mt-16 flex flex-col">
      <h2>{company.name}</h2>
      <p>{company.description}</p>
      <a href={company.website} target="_blank">
        {company.website}
      </a>
      <a href={`https://www.instagram.com/${company.instagram_handle}/`} target="_blank">
        {company.instagram_handle}
      </a>
      <img src={company.logo} />
      <p>{company.shops?.length || 0} shops</p>

      <ShopList coffeeShops={shopsGeoJSON.features} />
    </div>
  )
}
