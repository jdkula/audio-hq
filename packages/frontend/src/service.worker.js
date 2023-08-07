/// <reference lib="webworker" />
/**
 * service.worker.js
 * ===================
 * Audio HQ Service Worker. Enables AHQ's offline mode.
 */

import { get } from 'idb-keyval';
import { kMaxConcurrentDownloads } from '~/lib/constants';

// <== Globals ==>

// Populated with a list of files to cache by workbox
const manifest = self.__WB_MANIFEST || [];
const staticUrlsToCache = ['/', '/index.html', '/workspace.html', '/404.html', '/site.webmanifest'];

// Audio data storage
const audioCache = caches.open('ahq-audio-v1');

// Application data storage
const kCacheKey = 'ahq-app-v3';
const appCache = caches.open(kCacheKey);

// Broadcast in from the frontend and out to the frontend
const broadcastIn = new BroadcastChannel('audio-hq-to-sw');
const broadcastOut = new BroadcastChannel('audio-hq-from-sw');

// <== Data Access ==>

// Returns true if offline mode is enabled
async function offlineEnabled() {
    return (await get('should_cache')) ?? false;
}

// <== Audio Caching ==>

/** Batch-caches URLs */
async function cacheUrls(urls) {
    const promises = [];
    for (const url of urls) {
        if (promises.length > kMaxConcurrentDownloads) {
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

// <== Client Management ==>

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

/** Broadcasts the entire cache state to the given client/page */
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

// <== Application Cache Management ==>

/** Retrieves and gives back cached data, if it exists. */
async function ahqCache(request) {
    const audioCacheResponse = await (await audioCache).match(request.url);
    if (audioCacheResponse) {
        console.log('Successfully retrieved cached data for audio URL', request.url);
        return audioCacheResponse;
    }
    if (!(await offlineEnabled())) {
        return await fetch(request);
    }

    try {
        const response = await fetch(request);
        try {
            if (new URL(request.url).origin === self.location.origin) {
                await (await appCache).put(request.url, response.clone());
                console.log('Successfully updated cache for app url', request.url);
            }
        } catch (e) {
            console.warn('Error caching url', request.url, e);
        }
        return response;
    } catch (e) {
        const appCacheResponse = await (await appCache).match(request.url);
        if (appCacheResponse) {
            cacheUrl(await appCache, request.url);
            return appCacheResponse;
        }
        throw e;
    }
}

/** Caches the given URL, automatically testing and caching for bare urls as well. */
async function cacheUrl(cache, url) {
    const bareUrl = url.replace(/\.html$/, '');

    try {
        const response = await fetch(url);
        if (response.status === 200) {
            // If the URL ends in HTML, also save this response for the bare url.
            if (url.endsWith('.html')) {
                cache.put(bareUrl, response.clone());
            }
            cache.put(url, response);

            // If we didn't find this page.html, try accessing the bare url.
        } else if (response.status === 404 && url.endsWith('.html')) {
            const bareResponse = await fetch(bareUrl);
            if (bareResponse.status === 200) {
                cache.put(bareUrl, bareResponse.clone());
                cache.put(url, bareResponse);
            }
        }
    } catch (e) {
        console.warn(e);
    }
}

/** Caches all static assets */
async function cacheStatic() {
    const cache = await appCache;

    await Promise.all([...staticUrlsToCache, ...manifest.map((entry) => entry.url)].map((url) => cacheUrl(cache, url)));
}

/** Clears the given cache */
async function clearCache(cacheProm) {
    const cache = await cacheProm;
    const keys = await cache.keys();
    await Promise.all(keys.map((key) => cache.delete(key)));
}

// <== Event Listeners ==>

/** Respond with cached data if possible, using a SWR "cache-and-network" pattern */
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    if (event.request.method !== 'GET') return;
    if (
        !url.protocol.startsWith('http') ||
        (url.origin === self.location.origin && url.pathname.includes('api')) ||
        url.pathname.includes('socket.io')
    ) {
        return;
    }

    event.respondWith(ahqCache(event.request));
});

/** Cache home page and workspace view on install */
self.addEventListener('activate', (event) => {
    // Clients should be defined in the web worker context
    // eslint-disable-next-line no-undef
    event.waitUntil(clients.claim());
    event.waitUntil(offlineEnabled().then((should) => should && cacheStatic()));
});

self.addEventListener('install', () => {
    self.skipWaiting();
});

// <== Communication from frontend ==>

broadcastIn.onmessage = (ev) => {
    switch (ev.data.type) {
        // <-- Fetches and caches all the associated URLs with CORS -->
        case 'cache': {
            cacheUrls(ev.data.urls).then(() => updateCacheStateAll());
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

        // <-- Asks for the state of the entire cache -->
        case 'is-cached-bulk': {
            updateCacheStateAll();
            break;
        }

        // <-- Turns off and deletes all data from the cache -->
        case 'clear-cache': {
            Promise.all([clearCache(audioCache), clearCache(appCache)])
                .then(() => updateCacheStateAll())
                .then(() => console.log('Cleared caches'));
            break;
        }

        // <-- Caches all static assets for offline mode -->
        case 'cache-on': {
            cacheStatic();
            break;
        }

        // <-- Checks query cache key -->
        case 'cache-buster-in': {
            if (ev.data.key !== kCacheKey) {
                broadcastOut.postMessage({
                    type: 'cache-buster-out',
                    shouldReload: true,
                    key: kCacheKey,
                });
            }
            break;
        }
    }
};
