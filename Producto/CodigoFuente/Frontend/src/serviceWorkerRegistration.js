self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('parque-eco-v1').then((cache) => {
        return cache.addAll([
          '/',
          '/index.html',
          '/static/js/bundle.js',
          '/icon-192x192.png',
          '/icon-512x512.png'
        ]);
      })
    );
  });