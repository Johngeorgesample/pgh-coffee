import haversineDistance from 'haversine-distance'
import { TShop } from '@/types/shop-types'

export const shopsByDistance = (shops: TShop[], point: [number, number]) =>
  shops
    .map(shop => ({ shop, meters: haversineDistance(point, shop.geometry.coordinates) }))
    .sort((a, b) => a.meters - b.meters)

const NEAR_RESULT_COUNT = 10

export const nearestShops = (shops: TShop[], point: [number, number]) =>
  shopsByDistance(shops, point).slice(0, NEAR_RESULT_COUNT)
