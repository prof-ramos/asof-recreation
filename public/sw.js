// service-worker.js

const CACHE_NAME = 'asof-v1';
const urlsToCache = [
  '/',
  '/noticias',
  '/filie-se',
  '/sobre',
  '/eventos',
  '/biblioteca',
  '/css/style.css', // Assumindo que você tenha arquivos estáticos
  '/js/app.js'
];

// Instalação do service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Intercepção de requisições de rede
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retorna o cache se encontrado, senão faz a requisição de rede
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Ativação do service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Excluindo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});