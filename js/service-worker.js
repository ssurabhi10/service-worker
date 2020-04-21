console.log('WORKER: executing.');

const CACHE_NAME = 'web-app-cache';

const rootDir = 'https://ssurabhi-in.github.io/service-worker/';

const urlsToCache = [
    rootDir,
    `${rootDir}css/global.css`,
    `${rootDir}images/pixel.gif`,
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
                params = {
                    [reqParams.interaction]: 'UserClick',
                    [reqParams.client]: 'ad_media',
                    [reqParams.os_name]: 'macos',
                    [reqParams.x1]: 'google',
                    [reqParams.x2]: 'email',
                    [reqParams.x3]: 'pdfconvert',
                    [reqParams.landing_url]: 'abcd1'
                }

              return fetch(event.request, params).then(response => {
                return cache.put(event.request, response.clone()).then(() => {
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