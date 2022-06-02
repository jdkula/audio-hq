import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';

export const broadcast = new BroadcastChannel('audio-hq');

export type BroadcastMessage = WorkerBroadcastMessage | CacheUpdateMessage;

export interface WorkerBroadcastMessage {
    type: 'cache' | 'evict' | 'is-cached';
    urls: string[];
}

export interface CacheUpdateMessage {
    type: 'cache-update';
    url: string;
    cached: CacheState;
}

export type CacheState = 'cached' | 'uncached' | 'loading';

export function useIsCached(urls: string[]): CacheState[] {
    const [cached, setCached] = useState<CacheState[]>(() => _.fill(new Array<CacheState>(urls.length), 'loading'));

    const oldUrls = useRef([...urls]);

    const onUpdate = useCallback(
        (ev: MessageEvent) => {
            const message: BroadcastMessage = ev.data;
            if (message.type !== 'cache-update') return;
            const idx = urls.indexOf(message.url);
            if (idx < 0) return;
            setCached((cached) => {
                const copy = [...cached];
                copy[idx] = message.cached;
                return copy;
            });
        },
        [urls],
    );

    useEffect(() => {
        broadcast.addEventListener('message', onUpdate);
        // setCached(_.fill(new Array<CacheState>(urls.length), 'loading'));
        oldUrls.current = [...urls];
        broadcast.postMessage({
            type: 'is-cached',
            urls: urls,
        } as BroadcastMessage);
        return () => {
            broadcast.removeEventListener('message', onUpdate);
        };
    }, [urls, onUpdate]);

    return cached;
}
