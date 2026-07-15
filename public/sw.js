const cacheName = "industry-glossary-static-v2";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== cacheName).map((key) => caches.delete(key)))).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);
  const isStaticAsset = event.request.method === "GET" && requestUrl.origin === self.location.origin && (requestUrl.pathname.startsWith("/_next/static/") || requestUrl.pathname.startsWith("/icons/"));

  if (!isStaticAsset) return;

  event.respondWith(
    caches.open(cacheName).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) return cachedResponse;

      const networkResponse = await fetch(event.request);
      if (networkResponse.ok) await cache.put(event.request, networkResponse.clone());
      return networkResponse;
    }),
  );
});
