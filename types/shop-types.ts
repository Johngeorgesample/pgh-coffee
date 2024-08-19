import { TNeighborhood } from './neighborhood-types'

export interface TShop {
  name: string
  neighborhood: string // @TODO make `TNeighborhood` work
  address: string
  photo?: string
  website: string // @TODO make `URL` work
  value?: any
}
