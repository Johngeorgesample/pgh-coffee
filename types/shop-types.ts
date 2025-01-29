import { TNeighborhood } from './neighborhood-types'

export interface TShop {
  type: string,
  properties: {
    name: string
    neighborhood: TNeighborhood
    address: string
    photo?: string
    website: string
  }
  geometry: {
    type: string,
    coordinates: [number, number]
  }
}
