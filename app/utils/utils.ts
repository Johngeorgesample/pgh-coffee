import { DbShop, TFeatureCollection } from '@/types/shop-types'

export const formatDataToGeoJSON = (shops: DbShop[]): TFeatureCollection => {
  const myObj: TFeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  }

  shops.forEach(shop => {
    myObj.features.push({
      type: 'Feature',
      properties: {
        name: shop.name,
        company: shop.company,
        neighborhood: shop.neighborhood,
        website: shop.website,
        address: shop.address,
        photo: shop.photo ?? undefined,
        uuid: shop.uuid
      },
      geometry: {
        type: 'Point',
        coordinates: [shop.longitude ?? 0, shop.latitude ?? 0],
      },
    })
  })

  return myObj
}

export const formatDBShopAsFeature = (shop: DbShop): TFeatureCollection['features'][number] => {
  return (
    {
      type: 'Feature',
      properties: {
        name: shop.name,
        company: shop.company,
        neighborhood: shop.neighborhood,
        website: shop.website,
        address: shop.address,
        photo: shop.photo ?? undefined,
        uuid: shop.uuid
      },
      geometry: {
        type: 'Point',
        coordinates: [shop.longitude ?? 0, shop.latitude ?? 0],
      }
    }
  )
}

export const parseYMDLocal = (ymd: string) => {
  const [y, m, d] = ymd.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const fmtYMD = (ymd?: string) =>
  ymd
    ? new Intl.DateTimeFormat(undefined, { dateStyle: 'short' }).format(parseYMDLocal(ymd))
    : ''
