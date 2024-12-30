'use client';

import { FC } from 'react';

import '@emotion/react';

import { useEffect, useRef, ReactNode } from 'react';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AudioHQApiContext from '~/lib/api/context';
import { localStoragePersister, queryClient } from '~/lib/queryclient';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { AudioHQClient } from '@audio-hq/clients/lib/AudioHQClient';
import SocketTransport from '@audio-hq/clients/lib/impl/socketio.transport';
import { BroadcastMessage, broadcastOut } from '~/lib/sw_client';

const AppRootClient: FC<{ children: ReactNode }> = ({ children }) => {
    const apiClient = useRef(new AudioHQClient(new SocketTransport(process.env.NEXT_PUBLIC_WS_BASE as string)));

    /** Use caching service worker */
    const tryRegistered = useRef(false);
    useEffect(() => {
        if (tryRegistered.current) return;
        tryRegistered.current = true;

        navigator.serviceWorker
            .register('/service.worker.dist.js', { type: 'module' })
            .then(() => {
                setTimeout(() => {
                    broadcastOut?.postMessage({
                        type: 'cache-buster-in',
                        key: window.localStorage.getItem('AHQ_CACHE_KEY') ?? '',
                    } satisfies BroadcastMessage);
                }, 1500);
            })
            .catch((e) => {
                console.log('Service worker registration failed', e);
            });
    }, []);

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{
                persister: localStoragePersister,
                maxAge: Number.POSITIVE_INFINITY,
            }}
        >
            <AudioHQApiContext.Provider value={apiClient.current}>{children}</AudioHQApiContext.Provider>
            <ReactQueryDevtools initialIsOpen={true} />
        </PersistQueryClientProvider>
    );
};

export default AppRootClient;
