/**
 * Service Worker for Pivori Studio
 * Enables offline support and caching strategies
 */

const CACHE_NAME = 'pivori-studio-v1'
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/assets/index.css',
  '/assets/index.js'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...')
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('✅ Caching static assets')
      return cache.addAll(STATIC_ASSETS).catch((error) => {
        console.warn('⚠️ Failed to cache some assets:', error)
      })
    })
  )
  
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  
  self.clients.claim()
})

// Fetch event - implement caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return
  }

  // Cache-first strategy for static assets
  if (request.destination === 'style' || request.destination === 'script') {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response
        }
        
        return fetch(request).then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type === 'error') {
            return response
          }
          
          // Clone and cache the response
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache)
          })
          
          return response
        }).catch(() => {
          // Return cached version if fetch fails
          return caches.match(request)
        })
      })
    )
    return
  }

  // Network-first strategy for API calls
  if (url.pathname.startsWith('/api')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response && response.status === 200) {
            const responseToCache = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache)
            })
          }
          return response
        })
        .catch(() => {
          // Return cached response if network fails
          return caches.match(request).then((response) => {
            if (response) {
              return response
            }
            // Return offline page if available
            return caches.match('/offline.html')
          })
        })
    )
    return
  }

  // Stale-while-revalidate for HTML
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((response) => {
        if (response && response.status === 200) {
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache)
          })
        }
        return response
      })

      return cachedResponse || fetchPromise
    })
  )
})

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

console.log('✅ Service Worker loaded')

