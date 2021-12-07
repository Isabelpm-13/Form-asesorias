let staticCache = 'staticCache@v1';
let dynamicCache = 'dynamicCache@v1';
let immutableCache = 'immutableCache@v1';

self.addEventListener('install', event => {
    console.log("SW Install");

    const _files = [
      "/index.html",
      "/style.css",
      "/js/indexedDB.js",
      "/assets/icons/noconnection.png",
       "/app.js",
 
    ];
  
    const _IMMUTABLE_FILES = [
      "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js",
      "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
    ];
  

    const saveStaticCache = caches.open(staticCache)
        .then((cache) => cache.addAll(_files));

    const saveImmutableCache = caches.open(immutableCache)
        .then((cache) => cache.addAll(_IMMUTABLE_FILES));

    event.waitUntil(Promise.all([saveStaticCache, saveImmutableCache]));
});

//Actualizar la caché
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(cacheList => {
            return Promise.all(
                cacheList.map(cache => { 
                    if (!staticCache.includes(cache) && !immutableCache.includes(cache)) {
                        return caches.delete(cache);
                    }
                }));
        })
    );
});



self.addEventListener("message", (msgClient) => {
  if (msgClient.data.action == "skipWaiting") {
    self.skipWaiting();
  }
});

//3 Cache First
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request);
    })
  );
});


