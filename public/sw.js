const CACHE_VERSION = "v20260228-2";
const IMAGE_CACHE = `sausalito-image-cache-${CACHE_VERSION}`;
const ASSET_CACHE = `sausalito-asset-cache-${CACHE_VERSION}`;
const ACTIVE_CACHES = new Set([IMAGE_CACHE, ASSET_CACHE]);

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((cacheName) => !ACTIVE_CACHES.has(cacheName))
          .map((cacheName) => caches.delete(cacheName)),
      );
      await self.clients.claim();
    })(),
  );
});

function isCacheableResponse(response) {
  if (!response) return false;
  if (response.status === 200) return true;
  return response.type === "opaque";
}

function isImageRequest(request) {
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return false;
  if (request.destination === "image") return true;
  return /\.(png|jpe?g|webp|gif|svg|avif|ico)$/i.test(url.pathname) || url.pathname.startsWith("/media/");
}

function isStaticAssetRequest(request) {
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return false;
  return url.pathname.startsWith("/assets/") || /\.(js|css|woff2?|ttf)$/i.test(url.pathname);
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const networkFetchPromise = fetch(request)
    .then(async (response) => {
      if (isCacheableResponse(response)) {
        try {
          await cache.put(request, response.clone());
        } catch {
          // ignore cache write failures and still return network response
        }
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    return cached;
  }

  const networkResponse = await networkFetchPromise;
  if (networkResponse) return networkResponse;
  return Response.error();
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (isCacheableResponse(response)) {
      try {
        await cache.put(request, response.clone());
      } catch {
        // ignore cache write failures and still return network response
      }
    }
    return response;
  } catch {
    return Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  if (isImageRequest(request)) {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
    return;
  }

  if (isStaticAssetRequest(request)) {
    event.respondWith(cacheFirst(request, ASSET_CACHE));
  }
});
