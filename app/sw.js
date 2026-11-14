const CACHE_NAME = 'protocolo-calistenia-v23';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/app.css',
  './js/nutri-db.js',
  './js/supabase-client.js',
  './js/gemini-nutrition.js',
  './js/state.js',
  './js/exercises-db.js',
  './js/exercise-animator.js',
  './js/recipes-db.js',
  './js/workout-player.js',
  './js/views.js',
  './js/app.js',
  './manifest.json',
  './assets/favicon.svg',
  './assets/fonts/inter-latin.woff2'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Cache fallback on install:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      );
    })
  );
  self.clients.claim();
});

// Cache com suporte a lazy loading para vídeos de treinos
self.addEventListener('fetch', (e) => {
  const url = e.request.url;

  // Cache dinâmico para vídeos e posters locais de exercícios
  if (url.includes('/assets/videos/') || url.includes('/assets/')) {
    e.respondWith(
      caches.match(e.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(e.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
          }
          return networkResponse;
        }).catch(() => {
          // Fallback silencioso
          return caches.match('./assets/vsl-poster.jpg');
        });
      })
    );
    return;
  }

  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});

// Notificações Push Tácticas de Lembrete de Treino
self.addEventListener('push', (e) => {
  let data = { title: 'Protocolo de Calistenia', body: 'Soldado, tu misión diaria de 21 días te espera en el Centro de Comando. ¡Cero excusas!' };
  if (e.data) {
    try { data = e.data.json(); } catch(err) { data.body = e.data.text(); }
  }

  const options = {
    body: data.body,
    icon: './assets/favicon.svg',
    badge: './assets/favicon.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      { action: 'start', title: 'Iniciar Misión ›' },
      { action: 'close', title: 'Más tarde' }
    ]
  };

  e.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/app') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});
