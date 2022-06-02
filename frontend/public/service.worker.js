const broadcast = new BroadcastChannel('audio-hq');

const putInCache = async (request, response) => {
    const cache = await caches.open('v1');
    console.log('Caching', request.url);
    await cache.put(request, response);
    broadcast.postMessage({
        type: 'cache-update',
        url: request.url,
        cached: 'cached',
    });
};

const cacheFirst = async (request) => {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
        return responseFromCache;
    }
    return await fetch(request);
};

self.addEventListener('fetch', (event) => {
    console.log('SW Got Fetch', event.request.url);
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

broadcast.onmessage = (ev) => {
    console.log('SW Got Message', ev.data);
    switch (ev.data.type) {
        case 'cache': {
            (async () => {
                const cache = await caches.open('v1');
                await Promise.all(
                    ev.data.urls.map(async (url) => {
                        const ri = {
                            cache: 'no-store',
                            mode: 'cors',
                        };
                        if ((await cache.keys(url)).length > 0) {
                            return;
                        }
                        broadcast.postMessage({
                            type: 'cache-update',
                            url,
                            cached: 'loading',
                        });
                        const res = await fetch(url, ri);
                        if (res.status === 200) {
                            await cache.put(url, res);
                            broadcast.postMessage({
                                type: 'cache-update',
                                url,
                                cached: 'cached',
                            });
                        }
                    }),
                );
            })();
            break;
        }

        case 'evict': {
            (async () => {
                const cache = await caches.open('v1');

                await Promise.all(ev.data.urls.map((url) => cache.delete(url)));
                ev.data.urls.forEach((url) => {
                    broadcast.postMessage({
                        type: 'cache-update',
                        url,
                        cached: 'uncached',
                    });
                });
            })();
            break;
        }
        case 'is-cached': {
            (async () => {
                const cache = await caches.open('v1');

                await Promise.all(
                    ev.data.urls.map(async (url) => {
                        const requests = await cache.keys(url);
                        broadcast.postMessage({
                            type: 'cache-update',
                            url,
                            cached: requests.length > 0 ? 'cached' : 'uncached',
                        });
                    }),
                );
            })();
            break;
        }
    }
};
