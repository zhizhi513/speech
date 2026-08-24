// Speech PWA Service Worker - 让姐姐手机没网也能用
const CACHE = 'speech-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './answers/'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      // 预缓存核心页面（answers 文件很多，先不全缓存，按需缓存）
      return cache.addAll(['./', './index.html']);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

// 缓存优先（cache-first），离线可用
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // CDN 字体和 React：网络优先，缓存兜底
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

  // 本地资源（index.html 和 answers/）：缓存优先
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        // 只缓存 GET 成功的 md/html
        if (e.request.method === 'GET' && res.ok) {
          const c = res.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, c));
        }
        return res;
      }).catch(() => {
        // 离线兜底
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});