// Service Worker para E2E-Commerce PWA - Otimizado
const CACHE_NAME = 'e2e-commerce-v2';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';

// Cache apenas arquivos essenciais
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/cloudflare-integration.js'
];

// Cache de recursos externos
const externalResources = [
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install event - Cache apenas arquivos essenciais
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Caching static assets');
        return cache.addAll(urlsToCache);
      }),
      caches.open(DYNAMIC_CACHE).then(cache => {
        console.log('Caching external resources');
        return cache.addAll(externalResources);
      })
    ])
  );
  // Skip waiting para ativação imediata
  self.skipWaiting();
});

// Fetch event - Estratégia cache-first otimizada
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requests não-HTTP
  if (!request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(request).then(response => {
      if (response) {
        return response;
      }

      // Network-first para API calls
      if (url.pathname.startsWith('/api/')) {
        return fetch(request).catch(() => {
          return new Response('Offline', { status: 503 });
        });
      }

      // Cache-first para assets estáticos
      return fetch(request).then(fetchResponse => {
        if (fetchResponse.status === 200) {
          const responseClone = fetchResponse.clone();
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, responseClone);
          });
        }
        return fetchResponse;
      }).catch(() => {
        // Fallback para páginas
        if (request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// Activate event - Limpeza otimizada
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (![STATIC_CACHE, DYNAMIC_CACHE].includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control imediatamente
  self.clients.claim();
});

