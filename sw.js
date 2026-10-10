const CACHE_NAME = 'biblia-app-cache-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/js/index.js',
  '/js/versiculo_diario.js',
  '/js/mobile-menu.js',
  '/js/register-sw.js',
  '/css/style.css',
  '/css/biblia.css',
  '/img/logo_2.png',
  '/img/logo.png',
  '/img/logo_3.png',
  '/img/fondo.avif'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
    ))
    .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
