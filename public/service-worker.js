const CACHE_NAME = "recipe-cache-v1";
const IMAGE_CACHE = "recipe-images-v1";

// Daftar endpoint API yang ingin dicache
const API_CACHE_ROUTES = [
  "/api/recipes",
  "/api/makanan",
  "/api/minuman",
];

// Install SW → buat cache awal
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(() => {
      console.log("Service Worker Installed");
    })
  );
});

// Fetch Intercept
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // ---- 1. Cache untuk Gambar ----
  if (request.destination === "image") {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(request).then((cached) => {
          if (cached) return cached;

          return fetch(request).then((response) => {
            cache.put(request, response.clone());
            return response;
          });
        });
      })
    );
    return;
  }

  // ---- 2. Cache untuk API JSON ----
  if (API_CACHE_ROUTES.some((route) => request.url.includes(route))) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, response.clone());
            return response;
          });
        });
      })
    );
    return;
  }

  // Default (tidak di-cache)
  event.respondWith(fetch(request));
});
