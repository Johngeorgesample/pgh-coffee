'use client'

import { useState, useEffect } from 'react'

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

  return (
    <div>
      <h2>{company.name}</h2>
      <p>{company.shops?.length || 0} shops</p>
    </div>
  )
}
