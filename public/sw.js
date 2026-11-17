const CACHE_NAME = 'lexiclip-pwa-cache-v1'
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icons.svg',
  '/vocab/master-lexicon.json',
  '/vocab/master-roots.json',
  '/videos/daily_commute.webm',
  '/videos/daily_cafe.webm',
  '/videos/daily_supermarket.webm',
  '/videos/daily_perspective.webm',
]

// 安裝 Service Worker 並預快取核心靜態資產
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS).catch((err) => {
          console.warn('[SW] Pre-caching partial assets failed:', err)
        })
      })
      .then(() => self.skipWaiting())
  )
})

// 啟用 Service Worker 並清理過期舊快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              return caches.delete(name)
            }
          })
        )
      })
      .then(() => self.clients.claim())
  )
})

// 攔截網路請求以支援離線訪問 (Stale-While-Revalidate / Cache-First)
self.addEventListener('fetch', (event) => {
  const req = event.request

  // 僅快取 GET 請求，忽略其他方法與 YouTube 跨域 iframe
  if (req.method !== 'GET') return
  if (!req.url.startsWith(self.location.origin)) return

  // 針對影片或詞庫大檔優先走 Cache-First
  if (req.url.includes('/videos/') || req.url.includes('/vocab/')) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached
        return fetch(req).then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const clone = networkRes.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone))
          }
          return networkRes
        })
      })
    )
    return
  }

  // 常規靜態資產走 Stale-While-Revalidate
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const clone = networkRes.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone))
          }
          return networkRes
        })
        .catch(() => cached)

      return cached || fetchPromise
    })
  )
})
