// Service Worker para Cromos FWC2026
// Versión: actualiza este número cuando hagas cambios importantes
const CACHE_VERSION = 'cromos-fwc2026-v5';

// Archivos críticos que se cachean al instalar
const CACHE_INICIAL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
];

// Cuando se instala el SW por primera vez
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando service worker...');
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      console.log('[SW] Cacheando archivos iniciales');
      return cache.addAll(CACHE_INICIAL).catch((err) => {
        console.warn('[SW] Algunos archivos no se pudieron cachear:', err);
      });
    })
  );
  // Activar inmediatamente sin esperar
  self.skipWaiting();
});

// Cuando se activa el SW
self.addEventListener('activate', (event) => {
  console.log('[SW] Activando service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_VERSION)
          .map((name) => {
            console.log('[SW] Borrando caché viejo:', name);
            return caches.delete(name);
          })
      );
    })
  );
  // Tomar control de las páginas abiertas inmediatamente
  self.clients.claim();
});

// Estrategia de fetch: Network First, fallback a Cache
// Esto asegura que siempre intenta traer la última versión,
// pero si no hay internet, usa lo que tiene en cache
self.addEventListener('fetch', (event) => {
  // Solo cachear requests HTTP/HTTPS (ignorar chrome-extension, etc)
  if (!event.request.url.startsWith('http')) return;
  
  // Skip Firebase y Google Auth - siempre van a la red
  if (
    event.request.url.includes('firebase') ||
    event.request.url.includes('googleapis') ||
    event.request.url.includes('google.com') ||
    event.request.url.includes('gstatic')
  ) {
    return;
  }

  // Para requests GET solamente
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la respuesta es buena, la cacheamos para uso futuro
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_VERSION).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Si falla la red, intentamos servir desde cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Si no hay cache, devolvemos página principal (para SPA routing)
          return caches.match('/');
        });
      })
  );
});

// Listener para mensajes desde la app (futuro: notificaciones, etc.)
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

console.log('[SW] Service worker cargado v' + CACHE_VERSION);