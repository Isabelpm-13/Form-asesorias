//sw

let staticCache = 'staticCache@v1';
let dynamicCache = 'dynamicCache@v1';
let immutableCache = 'immutableCache@v1';

self.addEventListener('install', event => {
    console.log("SW Install");
const _files = [
    "/index.html",
    "/style.css",
    "/js/indexedDB.js",
     "/js/app.js",
     "manifest.json",
     "sw.js",
     "/assets/icons/noconnection.png",
     "/assets/icons/icon-192x192.png",
     "/assets/icons/icon-256x256.png",
     "/assets/icons/icon-384x384.png",
     "/assets/icons/icon-512x512.png",

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

self.addEventListener('activate', e => {

    const respuesta = caches.keys().then( keys => {

        keys.forEach( key => {

            if (  key !== staticCache && key.includes('static') ) {
                return caches.delete(key);
            }

            if (  key !== dynamicCache && key.includes('dynamic') ) {
                return caches.delete(key);
            }

        });

    });

    e.waitUntil( respuesta );

});



self.addEventListener( 'fetch', e => {


    const respuesta = caches.match( e.request ).then( res => {

        if ( res ) {
            return res;
        } else {

            return fetch( e.request ).then( newRes => {

                return updateCacheDynamic( dynamicCache, e.request, newRes );

                function updateCacheDynamic(dynamicCache, req, res){

                    if (res.ok) {
                        caches.open( dynamicCache).then(cache => {
                            cache.put ( req, res.clone());
                
                            return res.clone();
                        })
                    } else {
                        return res;
                    }
                }

            });

        }

    });



    e.respondWith( respuesta );

});




