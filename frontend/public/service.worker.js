/**
 * service.worker.js
 * ===================
 * Audio HQ Service Worker. Enables AHQ's offline mode.
 */
const audioCache = caches.open('ahq-audio-v1');
const appCache = caches.open('ahq-app-v1');

const broadcastIn = new BroadcastChannel('audio-hq-to-sw');
const broadcastOut = new BroadcastChannel('audio-hq-from-sw');

async function cacheUrls(urls) {
    const promises = [];
    const kMaxConcurrent = 2;
    for (const url of urls) {
        if (promises.length > kMaxConcurrent) {
            const [resolved] = await Promise.race(promises.map((p) => p.then(() => [p])));
            promises.splice(promises.indexOf(resolved), 1);
        }
        promises.push(cacheAudioAt(url));
    }

    await Promise.all(promises);
}

/** Caches the given URL in the audio cache */
async function cacheAudioAt(url) {
    const cache = await audioCache;
    if ((await cache.keys(url)).length > 0) {
        return;
    }
    updateCacheState(url, 'loading');
    const res = await fetch(url, {
        cache: 'no-store',
        mode: 'cors',
    });
    if (res.status === 200) {
        await cache.put(url, res);
        updateCacheState(url, 'cached');
    }
}

/** Evicts the given URL from the audio cache */
async function evictAudioAt(url) {
    const cache = await audioCache;
    await cache.delete(url);
    updateCacheState(url, 'uncached');
}

/** Determines if the given URL is cached, and update the frontend accordingly */
async function updateCacheStateFor(url) {
    const cache = await audioCache;
    const requests = await cache.keys(url);
    updateCacheState(url, requests.length > 0 ? 'cached' : 'uncached');
}

/** Broadcasts the cache state of a given URL to the client/page */
function updateCacheState(url, state) {
    broadcastOut.postMessage({
        type: 'cache-update',
        url,
        cached: state,
    });
}

async function updateCacheStateAll() {
    const cache = await audioCache;
    const requests = await cache.keys();

    broadcastOut.postMessage({
        type: 'bulk-cache-update',
        data: requests.map((r) => ({
            url: r.url,
            cached: 'cached',
        })),
    });
}

/** Retrieves and gives back cached data, if it exists. */
async function cacheFirst(request) {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
        return responseFromCache;
    }
    return await fetch(request);
}

// Respond with cached data if available
self.addEventListener('fetch', (event) => {
    event.respondWith(cacheFirst(event.request));
});

/** Cache home page and workspace view on install */
const urlsToCache = ['/', '/workspace'];
self.addEventListener('activate', (event) => {
    // event.waitUntil(appCache.then((cache) => cache.addAll(urlsToCache)));
});

broadcastIn.onmessage = (ev) => {
    console.log('SW Got Message', ev.data);
    switch (ev.data.type) {
        // <-- Fetches and caches all the associated URLs with CORS -->
        case 'cache': {
            cacheUrls(ev.data.urls);
            break;
        }

        // <-- Evicts all the given URLs from the audio cache -->
        case 'evict': {
            ev.data.urls.map(evictAudioAt);
            break;
        }

        // <-- Determines if the given URL is stored in the audio cache -->
        case 'is-cached': {
            ev.data.urls.map(updateCacheStateFor);
            break;
        }

        case 'is-cached-bulk': {
            updateCacheStateAll();
            break;
        }
    }
};
