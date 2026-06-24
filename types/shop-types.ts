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
  roaster?: { name: string; slug: string } | null
}

export type TCompanyReference = Omit<TCompany, 'shops'>

export interface DbShop {
  name: string
  neighborhood: TNeighborhood
  address: string
  company: TCompanyReference | null
  photo: string | null
  photos: Photo[] | null
  website: string
  uuid: string
  latitude: number | null
  longitude: number | null
  roaster?: boolean | string
  // Embedded roaster (joined via roaster_id) whose coffee the shop serves.
  roasterRef?: { name: string; slug: string; company_id: string | null } | null
  amenities?: string[]
}

// The roaster a shop serves, plus whether it's the shop's own in-house roaster.
export interface TShopRoaster {
  name: string
  slug: string
  inHouse: boolean
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
    amenities?: string[]
    roaster?: TShopRoaster | null
    selected?: boolean
  }
  geometry: {
    type: string
    coordinates: [number, number]
  }
}

export interface RoasterRef {
  id: string
  name: string
  slug: string
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
