const FRESH_FOR_MS = 30_000

const prefetched = new Map<string, { response: Promise<Response>; at: number }>()

export const shopHoursUrl = (shopId: string) => `/api/shops/hours/${shopId}`
export const shopEventsUrl = (shopId: string) => `/api/events?shop_id=${shopId}`
export const shopUpdatesUrl = (shopId: string) => `/api/updates?shop_id=${shopId}`

export const prefetchShopExtras = (shopId: string) => {
  for (const url of [shopHoursUrl(shopId), shopEventsUrl(shopId), shopUpdatesUrl(shopId)]) {
    const entry = prefetched.get(url)
    if (entry && Date.now() - entry.at < FRESH_FOR_MS) continue
    const response = fetch(url)
    response.catch(() => prefetched.delete(url))
    prefetched.set(url, { response, at: Date.now() })
  }
}

export const fetchShopExtra = (url: string, init?: RequestInit) => {
  const entry = prefetched.get(url)
  prefetched.delete(url)
  if (!entry || Date.now() - entry.at >= FRESH_FOR_MS) return fetch(url, init)
  return entry.response.then(
    res => (res.ok ? res : fetch(url, init)),
    () => fetch(url, init),
  )
}
