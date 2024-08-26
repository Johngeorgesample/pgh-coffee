import { TNeighborhood } from './neighborhood-types'

export interface TShopProperties {
  }

export interface TShop {
  type: string,
  properties: {
    name: string
    neighborhood: string // @TODO make `TNeighborhood` work
    address: string
    photo?: string
    website: string // @TODO make `URL` work
  }
  geometry: {
    type: string,
    coordinates: [number, number]
  }
}
