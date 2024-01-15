export interface TShop {
  name: string,
  neighborhood: string, // @TODO should this be a union type?
  address: string,
  website: string, // @TODO how can I verify a URL is valid? Is that a fool's errand?
  value: any,
}
