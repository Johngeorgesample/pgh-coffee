import { TNeighborhood } from "./neighborhood-types";

export interface TShop {
  name: string,
  neighborhood: TNeighborhood,
  address: string,
  website: string, // @TODO how can I verify a URL is valid? Is that a fool's errand?
  value: any,
}
