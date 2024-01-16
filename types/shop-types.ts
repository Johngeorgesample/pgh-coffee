import { TNeighborhood } from "./neighborhood-types";

export interface TShop {
  name: string,
  neighborhood: TNeighborhood,
  address: string,
  website: string, // @TODO make `URL` work
  value?: any,
}
