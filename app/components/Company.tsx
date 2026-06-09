'use client'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { Instagram } from 'lucide-react'
import LocationList from '@/app/components/LocationList'
import { useEffect, useReducer, useRef } from 'react'
import useShopsStore from '@/stores/coffeeShopsStore'
import { formatDataToGeoJSON } from '../utils/utils'
import { TCompany } from '@/types/shop-types'

const fetchCompanyData = async (slug: string): Promise<TCompany> => {
  const response = await fetch(`/api/companies/${slug}`)
  return response.json()
}

const updateUrlForCompany = (companySlug: string) => {
  const url = new URL(window.location.href)
  const params = new URLSearchParams(url.search)
  params.delete('shop')
  params.set('company', companySlug)
  url.search = params.toString()
  window.history.pushState(null, '', url.toString())
}

interface State {
  company: TCompany | null
  loading: boolean
}

type Action =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; company: TCompany }
  | { type: 'LOAD_ERROR' }

const initialState: State = { company: null, loading: true }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD_START':
      return { company: null, loading: true }
    case 'LOAD_SUCCESS':
      return { company: action.company, loading: false }
    case 'LOAD_ERROR':
      return { company: null, loading: false }
    default:
      return state
  }
}

export const Company = ({ slug }: { slug: string }) => {
  const { setOverrideShops } = useShopsStore()
  const [{ company, loading }, dispatch] = useReducer(reducer, initialState)
  const setOverrideShopsRef = useRef(setOverrideShops)
  setOverrideShopsRef.current = setOverrideShops

  useEffect(() => {
    const setOverrideShopsFn = setOverrideShopsRef.current
    let cancelled = false
    dispatch({ type: 'LOAD_START' })

    fetchCompanyData(slug)
      .then(data => {
        if (cancelled) return
        dispatch({ type: 'LOAD_SUCCESS', company: data })
        if (data?.slug) updateUrlForCompany(data.slug)
        if (data?.shops) {
          setOverrideShopsFn(formatDataToGeoJSON(data.shops))
        }
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: 'LOAD_ERROR' })
      })
    return () => {
      cancelled = true
      setOverrideShopsFn(null)
    }
  }, [slug])

  if (loading) {
    return (
      <div className="px-6 lg:px-4 mt-24 lg:mt-16 flex flex-col animate-pulse">
        <div className="flex items-center justify-between mb-2">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="flex gap-2">
            <div className="size-4 bg-gray-200 rounded"></div>
            <div className="size-4 bg-gray-200 rounded"></div>
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
              <Instagram className="size-4" />
            </a>
            <a href={company.website} target="_blank" rel="noopener noreferrer">
              <ArrowTopRightOnSquareIcon className="size-4" />
            </a>
          </div>
        </div>
        <p className="text-sm text-gray-600">{company.description}</p>
        <LocationList coffeeShops={shopsGeoJSON.features} hideShopNames={true} />
      </div>
    </div>
  )
}
