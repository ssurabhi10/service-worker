console.log('WORKER: executing.');

const CACHE_NAME = 'web-app-cache';

const urlsToCache = [
    '/',
    '/css/global.css',
    '/images/pixel.gif',
];

const reqParams = {
    interaction: 'event',
    client: 'customer',
    os_name: 'operating_system_name',
    x1: 'utm_source',
    x2: 'utm_medium',
    x3: 'utm_campaign',
    landing_url: 'campaign_url'
}

self.addEventListener('install', function(event) {
    // console.log(event, "install");
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function(cache) {
          console.log('Opened cache');
          return cache.addAll(urlsToCache);
        })
    );
  });


self.addEventListener('activate', function(event) {
    // console.log(event, "activate");
    event.waitUntil(
      caches.keys().then(keys => Promise.all(
        keys.map(key => {
          if (!urlsToCache.includes(key)) {
            return caches.delete(key);
          }
        })
      )).then(() => {
        console.log('Now ready to handle fetches!');
      })
    );
});

self.addEventListener("fetch", function(event) {
    console.log('WORKER: fetch event in progress.');
    if (event.request.method !== 'GET') {
      console.log('WORKER: fetch event ignored.', event.request.method, event.request.url);
      return;
    }

    const url = new URL(event.request.url);

    if (url.origin == location.origin && url.pathname == "/images/pixel.gif") {

        event.respondWith(
          caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
    
            return caches.open(CACHE_NAME).then(cache => {

                const requestForCache = event.request;

                const {interaction, client, os_name, x1, x2, x3, landing_url} = event.request.params;
                event.request.params = {
                    [reqParams.interaction]: interaction,
                    [reqParams.client]: client,
                    [reqParams.os_name]: os_name,
                    [reqParams.x1]: x1,
                    [reqParams.x2]: x2,
                    [reqParams.x3]: x3,
                    [reqParams.landing_url]: landing_url
                }

              return fetch(event.request).then(response => {
                return cache.put(requestForCache, response.clone()).then(() => {
                    return new Response(`<h1>${response}</h1>`, {
                        status: 204,
                        statusText: 'NO_CONTENT',
                        headers: new Headers({
                          'Content-Type': 'image/gif'
                        })
                      });
                });
              })
              .catch(() => {
                console.log('WORKER: fetch request failed in both cache and network.');
                return new Response('<h1>Service Unavailable</h1>', {
                  status: 503,
                  statusText: 'Service Unavailable',
                  headers: new Headers({
                    'Content-Type': 'text/html'
                  })
                });
              });
            });
          })
        );
      }
  });