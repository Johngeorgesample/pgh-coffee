export type MapView = { lng: number; lat: number; zoom: number; width: number; height: number }

function mercator(lng: number, lat: number, zoom: number) {
  const world = 512 * 2 ** zoom
  const sin = Math.sin((lat * Math.PI) / 180)
  return { x: ((lng + 180) / 360) * world, y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * world }
}

export function toMapPixel(view: MapView, lng: number, lat: number) {
  const center = mercator(view.lng, view.lat, view.zoom)
  const point = mercator(lng, lat, view.zoom)
  return { left: view.width / 2 + point.x - center.x, top: view.height / 2 + point.y - center.y }
}

export function staticMapUrl(view: MapView, token: string) {
  return `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/${view.lng},${view.lat},${view.zoom},0/${view.width}x${view.height}@2x?attribution=false&logo=false&access_token=${token}`
}
