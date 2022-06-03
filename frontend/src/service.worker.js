/**
 * service.worker.js
 * ===================
 * Audio HQ Service Worker. Enables AHQ's offline mode.
 */

import { ConstructionOutlined } from '@mui/icons-material';
import { get, set } from 'idb-keyval';

const manifest = self.__WB_MANIFEST || [];

// Stores audio data
const audioCache = caches.open('ahq-audio-v1');

// Stores application files (HTML, JS)
const appCache = caches.open('ahq-app-v1');

const broadcastIn = new BroadcastChannel('audio-hq-to-sw');
const broadcastOut = new BroadcastChannel('audio-hq-from-sw');

async function shouldCache() {
    return (await get('should_cache')) ?? false;
}

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
async function ahqCache(request) {
    if (await shouldCache()) {
        const audioCacheResponse = await (await audioCache).match(request);
        if (audioCacheResponse) {
            return audioCacheResponse;
        }

        const url = new URL(request.url);
        // if (url.pathname.match(/^\/?workspace(?:\.html)?/i)) {
        //     url.pathname = '/workspace.html';
        // } else if (url.pathname === '/') {
        //     url.pathname = '/index.html';
        // }

        const appCacheResponse = await (await appCache).match(url.toString());
        if (appCacheResponse) {
            // Update cache for next time if needed (SWR pattern)
            fetch(request)
                .then((response) => {
                    appCache.then((cache) => cache.put(request, response));
                })
                .catch(() => {
                    // We are offline; ignore
                });
            return appCacheResponse;
        }
    }
    return await fetch(request);
}

// Respond with cached data if available
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    if (!new URL(event.request.url).protocol.startsWith('http')) return;

    console.log('SW got fetch', event.request);
    event.respondWith(ahqCache(event.request));
});

async function cacheStatic() {
    const cache = await appCache;

    await Promise.all(
        [...urlsToCache, ...manifest.map((entry) => entry.url)].map(async (url) => {
            try {
                const response = await fetch(url);
                cache.put(url, response);
            } catch (e) {
                console.warn(e);
            }
        }),
    );
}

async function clearCache(cacheProm) {
    const cache = await cacheProm;
    const keys = await cache.keys();
    await Promise.all(keys.map((key) => cache.delete(key)));
}

/** Cache home page and workspace view on install */
const urlsToCache = ['/', '/index.html', '/workspace', '/workspace.html', '/404', '/404.html', '/site.webmanifest'];
self.addEventListener('activate', (event) => {
    event.waitUntil(shouldCache().then((should) => should && cacheStatic()));
});

broadcastIn.onmessage = (ev) => {
    console.log('Got message SW', ev.data);
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

        case 'cache-off': {
            Promise.all([clearCache(audioCache), clearCache(appCache)]).then(() => updateCacheStateAll());
            break;
        }

        case 'cache-on': {
            cacheStatic();
            break;
        }
    }
};
