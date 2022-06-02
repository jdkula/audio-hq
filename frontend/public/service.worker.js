const putInCache = async (request, response) => {
    const cache = await caches.open('v1');
    console.log('Caching', request.url);
    await cache.put(request, response);
};

const cacheFirst = async (request) => {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
        return responseFromCache;
    }
    const responseFromNetwork = await fetch(request);
    if (responseFromNetwork.status === 200) {
        putInCache(request, responseFromNetwork.clone());
    }
    return responseFromNetwork;
};

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        console.log('Invalid method:', event.request.method, event.request.url);
        return;
    }
    if (!new URL(event.request.url).protocol.startsWith('http')) {
        console.log('Invalid scheme:', event.request.url);
        return;
    }
    if (event.request.mode !== 'cors') {
        console.log('Invalid mode:', event.request.mode, event.request.url);
        return;
    }

    event.respondWith(cacheFirst(event.request));
});
