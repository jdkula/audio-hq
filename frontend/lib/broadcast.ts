import _ from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LocalIDBReactiveValue, useLocalReactiveValue } from './local_reactive';

export const broadcastOut = new BroadcastChannel('audio-hq-to-sw');
export const broadcastIn = new BroadcastChannel('audio-hq-from-sw');

export type BroadcastMessage =
    | WorkerBroadcastMessage
    | CacheUpdateMessage
    | BulkCacheUpdateMessage
    | BulkCacheRequestMessage;

export interface WorkerBroadcastMessage {
    type: 'cache' | 'evict' | 'is-cached';
    urls: string[];
}

export interface CacheUpdateMessage {
    type: 'cache-update';
    url: string;
    cached: CacheState;
}
export interface BulkCacheUpdateMessage {
    type: 'bulk-cache-update';
    data: Omit<CacheUpdateMessage, 'type'>[];
}

export interface BulkCacheRequestMessage {
    type: 'is-cached-bulk';
}

export type CacheState = 'cached' | 'uncached' | 'loading';

export function useIsCached(url: string, useBulk?: boolean): Omit<CacheUpdateMessage, 'type'> | null;
export function useIsCached(url: string[], useBulk?: boolean): Omit<CacheUpdateMessage, 'type'>[];
export function useIsCached(
    url: string | string[],
    useBulk = false,
): Omit<CacheUpdateMessage, 'type'>[] | Omit<CacheUpdateMessage, 'type'> | null {
    const urls = useMemo(() => (Array.isArray(url) ? url : [url]), [url]);

    const [cached, setCached] = useState<Omit<CacheUpdateMessage, 'type'>[]>([]);

    const onUpdate = useCallback(
        (ev: MessageEvent) => {
            const message: BroadcastMessage = ev.data;
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
            } else if (message.type === 'bulk-cache-update') {
                setCached(message.data.filter((url) => urls.includes(url.url)));
            }
        },
        [urls],
    );

    useEffect(() => {
        broadcastIn.addEventListener('message', onUpdate);
        if (useBulk) {
            broadcastOut.postMessage({
                type: 'is-cached-bulk',
            } as BroadcastMessage);
        } else {
            broadcastOut.postMessage({
                type: 'is-cached',
                urls: urls,
            } as BroadcastMessage);
        }
        return () => {
            broadcastIn.removeEventListener('message', onUpdate);
        };
    }, [urls, onUpdate, useBulk]);

    return Array.isArray(url) ? cached : cached[0] ?? null;
}
