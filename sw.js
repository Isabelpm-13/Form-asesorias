let staticCache = "staticCache-v8";
let dynamicCache = "dynamicCache-v8";
let immutableCache = "immutableCache-v8";

self.addEventListener("install", (event) => {
  console.log("INSTALL");

  const _files = [
    "/index.html",
    "/style.css",
    "/js/app.js",
    "/js/indexedDB.js",
    "/assets/icons/noconnection.png",
    "/app.js",
  ];

  const _IMMUTABLE_FILES = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
  ];

  const saveStaticCache = caches
    .open(staticCache)
    .then((cache) => cache.addAll(_files)); //Todos los caches ejemplo .open devuelven una promesa

  const saveImmutableCache = caches
    .open(immutableCache)
    .then((cache) => cache.addAll(_IMMUTABLE_FILES));

  event.waitUntil(Promise.all([saveStaticCache, saveImmutableCache]));
});
//Activación
self.addEventListener("activate", (e) => {
  e.waitUntil(
    //El código dentro va a esperar a que todo el bloque termine.
    caches.keys().then((cacheList) => {
      return Promise.all(
        cacheList.map((cache) => {
          if (!staticCache.includes(cache) && !immutableCache.includes(cache)) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

//First cache with backup
self.addEventListener("fetch", (event) => {
  const _RESULT = caches.match(event.request).then((cacheResponse) => {
    return (
      cacheResponse ||
      fetch(Event.request).then((networkResponse) => {
        caches.open(dynamicCache).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
    );
  });
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

//Cache ONLY
/*self.addEventListener('fetch', event => {
    event.respondWith(caches.match(event.request))
});*/

//Network ONLY
/*self.addEventListener('fetch',event =>{
    event.respondWith(fetch(event.request))
});*/

//Network First
/*self.addEventListener('fetch', event => {
        event.respondWith(
            fetch(event.request).then(networkResponse => {
                return networkResponse ||  caches.match(event.request)
            })
        );
    });*/
