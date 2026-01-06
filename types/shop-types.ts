import { TNeighborhood } from './neighborhood-types'

export interface Photo {
  path: string
}

export interface TCompany {
  id: string
  slug: string
  name: string
  website: string
  description: string
  instagram_handle: string
  shops?: DbShop[]
}

export type TCompanyReference = Omit<TCompany, 'shops'>

export interface DbShop {
  name: string
  neighborhood: TNeighborhood
  address: string
  company: TCompanyReference | null
  photo: string | null
  website: string
  uuid: string
  latitude: number | null
  longitude: number | null
  roaster?: boolean | string
}

export interface TFeatureCollection {
  type: 'FeatureCollection'
  features: TShop[]
}

export interface TShop {
  type: string
  properties: {
    company: TCompanyReference | null
    name: string
    neighborhood: TNeighborhood
    address: string
    photo?: string
    photos?: Photo[]
    website: string
    uuid: string
  }
  geometry: {
    type: string
    coordinates: [number, number]
  }
}

export interface TList {
  id: string
  title: string
  description: string
  featured: boolean
  created_by: string
  created_at: string
  updated_at: string
  header?: string
  shops: TShop[]
}
