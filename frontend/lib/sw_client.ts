/**
 * sw_client.ts
 * =============
 * Provides functions, hooks, and types for interacting with the service worker
 */
import { useCallback, useEffect, useState } from 'react';
import { kCacheEnabledKey } from './constants';
import { LocalIDBReactiveValue, useLocalReactiveValue } from './LocalReactive';

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

/** Returns a set of cache  */
export function useIsCached(urls: string[]): CacheUpdateData[] {
    const [cached, setCached] = useState<CacheUpdateData[]>([]);

    const onUpdate = useCallback(
        (ev: MessageEvent) => {
            const message: BroadcastMessage = ev.data;

            // Individual update
            if (message.type === 'cache-update') {
                if (!urls.includes(message.url)) return;

                setCached((cached) => {
                    const existient = cached.find((msg) => msg.url === message.url);
                    if (existient) {
                        existient.cached = message.cached;
                    } else {
                        cached.push(message);
                    }
                    return [...cached];
                });

                // Bulk update
            } else if (message.type === 'bulk-cache-update') {
                setCached(message.data.filter((url) => urls.includes(url.url)));
            }
        },
        [urls],
    );

    useEffect(() => {
        broadcastIn?.addEventListener('message', onUpdate);

        broadcastOut?.postMessage({
            type: 'is-cached-bulk',
        } as BroadcastMessage);

        return () => {
            broadcastIn?.removeEventListener('message', onUpdate);
        };
    }, [urls, onUpdate]);

    return cached;
}

/** Returns a useState-like interface for turning the cache on and off */
export function useShouldCache() {
    const shouldCache = useLocalReactiveValue(shouldCacheLRV);

    const callback = useCallback((value) => {
        if (value) {
            broadcastOut?.postMessage({ type: 'cache-on' } as BroadcastMessage);
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
