// Speech PWA Service Worker - v2 (修正缓存版本号强制更新)
const CACHE = 'speech-v2';
const CORE_ASSETS = [
  './',
  './index.html',
  './answers/'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll(['./', './index.html']);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  if (url.host !== location.host) {
    e.respondWith(
      fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // 本地资源：网络优先，缓存兜底（这样更新能立即生效）
  e.respondWith(
    fetch(e.request).then(res => {
      if (e.request.method === 'GET' && res.ok) {
        const c = res.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, c));
      }
      return res;
    }).catch(() => caches.match(e.request).then(cached => {
      if (cached) return cached;
      if (e.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    }))
  );
});