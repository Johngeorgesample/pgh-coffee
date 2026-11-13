const FRESH_FOR_MS = 30_000

const prefetched = new Map<string, Promise<Response>>()

export const shopHoursUrl = (shopId: string) => `/api/shops/hours/${shopId}`
export const shopEventsUrl = (shopId: string) => `/api/events?shop_id=${shopId}`
export const shopUpdatesUrl = (shopId: string) => `/api/updates?shop_id=${shopId}`

const forget = (url: string, response: Promise<Response>) => {
  if (prefetched.get(url) === response) prefetched.delete(url)
}

export const prefetchShopExtras = (shopId: string) => {
  for (const url of [shopHoursUrl(shopId), shopEventsUrl(shopId), shopUpdatesUrl(shopId)]) {
    if (prefetched.has(url)) continue
    const response = fetch(url)
    response.catch(() => forget(url, response))
    setTimeout(() => forget(url, response), FRESH_FOR_MS)
    prefetched.set(url, response)
  }
}

export const fetchShopExtra = (url: string, init?: RequestInit) => {
  const response = prefetched.get(url)
  prefetched.delete(url)
  if (!response) return fetch(url, init)
  return response.then(
    res => (res.ok ? res : fetch(url, init)),
    () => fetch(url, init),
  )
}
