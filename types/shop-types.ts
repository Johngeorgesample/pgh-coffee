import { TNeighborhood } from './neighborhood-types'

export interface TFeatureCollection {
  type: 'FeatureCollection'
  features: TShop[]
}

export interface TShop {
  type: string
  properties: {
    name: string
    neighborhood: TNeighborhood
    address: string
    photo?: string
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
