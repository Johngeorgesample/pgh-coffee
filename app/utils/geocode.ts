const PITTSBURGH = '-79.99585,40.440742'
const SEARCH_BBOX = '-80.45,40.15,-79.6,40.75'

export async function geocode(query: string, signal?: AbortSignal) {
  const params = new URLSearchParams({
    q: query,
    proximity: PITTSBURGH,
    bbox: SEARCH_BBOX,
    limit: '1',
    access_token: process.env.MAPBOX_ACCESS_TOKEN ?? '',
  })
  const res = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?${params}`, { signal })
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`)
  const feature = (await res.json()).features?.[0]
  if (!feature) return null
  return { coordinates: feature.geometry.coordinates as [number, number], label: feature.properties.name as string }
}
