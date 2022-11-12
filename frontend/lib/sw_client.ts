/**
 * sw_client.ts
 * =============
 * Provides functions, hooks, and types for interacting with the service worker
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { kCacheEnabledKey } from './constants';
import { LocalIDBReactiveValue, LocalReactiveValue, useLocalReactiveValue } from './LocalReactive';
import { Map } from 'immutable';

// <== Broadcast Channels ==>
// Outgoing to service worker
export let broadcastOut: BroadcastChannel | null = null;
// Incoming from service worker
export let broadcastIn: BroadcastChannel | null = null;

if (typeof window !== 'undefined') {
    broadcastOut = new BroadcastChannel('audio-hq-to-sw');
    broadcastIn = new BroadcastChannel('audio-hq-from-sw');
}

// We can note URLs as cached, uncached, or in the process of caching (loading)
export type CacheState = 'cached' | 'uncached' | 'loading';

export type BroadcastMessage =
    | WorkerTargetedMessageOut
    | BulkCacheRequestMessageOut
    | CacheUpdateMessageIn
    | BulkCacheUpdateIn;

interface WorkerTargetedMessageOut {
    type: 'cache' | 'evict' | 'is-cached';
    urls: string[];
}

interface BulkCacheRequestMessageOut {
    type: 'is-cached-bulk' | 'cache-off' | 'cache-on';
}

interface CacheUpdateData {
    url: string;
    cached: CacheState;
}

interface CacheUpdateMessageIn extends CacheUpdateData {
    type: 'cache-update';
}
interface BulkCacheUpdateIn {
    type: 'bulk-cache-update';
    data: CacheUpdateData[];
}

/** Determines whether or not caching is enabled */
export const shouldCacheLRV = new LocalIDBReactiveValue<boolean>(kCacheEnabledKey, false);

const cacheInfo = new LocalReactiveValue(Map<string, CacheState>());

const onUpdate = (ev: MessageEvent) => {
    const message: BroadcastMessage = ev.data;

    // Individual update
    if (message.type === 'cache-update') {
        cacheInfo.value = cacheInfo.value.set(message.url, message.cached);
        // Bulk update
    } else if (message.type === 'bulk-cache-update') {
        cacheInfo.value = Map(message.data.map((data) => [data.url, data.cached]));
    }
};

broadcastIn?.addEventListener('message', onUpdate);

broadcastOut?.postMessage({
    type: 'is-cached-bulk',
} as BroadcastMessage);

/** Returns a set of cache  */
export function useIsCached(urls: string[]): CacheUpdateData[] {
    const [cache] = useLocalReactiveValue(cacheInfo);

    return useMemo(
        () => urls.map((url) => ({ url, cached: cache.get(url) })).filter((d): d is CacheUpdateData => !!d.cached),
        [urls, cache],
    );
}

/** Returns a useState-like interface for turning the cache on and off */
export function useShouldCache() {
    const shouldCache = useLocalReactiveValue(shouldCacheLRV);

    const callback = useCallback((value) => {
        if (value) {
            broadcastOut?.postMessage({ type: 'cache-on' } as BroadcastMessage);
            if (navigator.storage?.persist as unknown) {
                navigator.storage
                    .persist()
                    .then((persisted) => {
                        if (!persisted) {
                            console.warn('Could not persist; storage may not work');
                        }
                    })
                    .catch((e) => {
                        console.warn('Could not persist; storage may not work', e);
                    });
            }
        } else {
            broadcastOut?.postMessage({ type: 'cache-off' } as BroadcastMessage);
        }
    }, []);

    useEffect(() => {
        shouldCacheLRV.on('set', callback);

        return () => {
            shouldCacheLRV.off('set', callback);
        };
    }, [callback]);

    return shouldCache;
}
