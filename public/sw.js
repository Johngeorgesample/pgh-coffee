const CACHE_NAME = 'pgh-coffee-v1'
const OFFLINE_URLS = ['/']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS)),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  )
})

// Network-first for navigations so users always get fresh content when online,
// falling back to the cached app shell when offline. Only the shell ('/') is
// cached so we never persist authenticated or route-specific HTML.
self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET' || request.mode !== 'navigate') return

  const url = new URL(request.url)
  const isShell = url.origin === self.location.origin && url.pathname === '/'

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (isShell) {
          const copy = response.clone()
          event.waitUntil(
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put('/', copy))
              .catch(() => {}),
          )
        }
        return response
      })
      .catch(() => caches.match('/')),
  )
})
