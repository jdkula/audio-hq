/**
 * _app.tsx
 * =========
 * Provides Audio HQ's global styles and CSS variables,
 * plus global <head/> elements.
 *
 * @author Jonathan Kula <jonathan@jdkula.dev>
 */

import '@emotion/react';

import { CssBaseline, ThemeProvider, createTheme, useMediaQuery } from '@mui/material';
import { ReactElement, useCallback, useEffect, useMemo, useRef } from 'react';

import { AppProps } from 'next/app';
import { ahqThemeBase } from '~/lib/theme';
import { deepmerge } from '@mui/utils';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { createEmotionCache } from '~/lib/ssr';
import { useColorMode } from '~/lib/utility/usePersistentData';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AudioHQApiContext from '~/lib/api/context';
import { localStoragePersister, queryClient } from '~/lib/queryclient';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { AudioHQApiImplProto } from 'clients/lib/impl/protobase';
import SocketTransport from 'clients/lib/impl/socketio.transport';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Allows the server to refresh its cache during each render.
interface SSRServerProps extends AppProps {
    emotionCache?: EmotionCache;
}
const clientSideEmotionCache = createEmotionCache();

export default function App({
    Component,
    pageProps,
    emotionCache = clientSideEmotionCache,
}: SSRServerProps): ReactElement {
    const apiClient = useRef(new AudioHQApiImplProto(new SocketTransport(process.env.NEXT_PUBLIC_WS_BASE as string)));

    // Set up theming
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [colorMode, setColorMode] = useColorMode();
    const theme = useMemo(
        () =>
            createTheme(
                deepmerge(ahqThemeBase, {
                    palette: { mode: colorMode === 'auto' ? (prefersDarkMode ? 'dark' : 'light') : colorMode },
                }),
            ),
        [colorMode, prefersDarkMode],
    );

    // <-- Press Alt/Opt+M to change color mode -->
    const forceModeListener = useCallback(
        (ev: KeyboardEvent) => {
            if (ev.code === 'KeyM' && ev.altKey) {
                ev.preventDefault();
                if (colorMode === 'auto') {
                    setColorMode(prefersDarkMode ? 'light' : 'dark');
                } else if (colorMode === 'light') {
                    setColorMode('dark');
                } else {
                    setColorMode('light');
                }
            }
        },
        [colorMode, setColorMode, prefersDarkMode],
    );

    useEffect(() => {
        window.addEventListener('keydown', forceModeListener);
        return () => window.removeEventListener('keydown', forceModeListener);
    }, [forceModeListener]);

    /** Use caching service worker */
    useEffect(() => {
        navigator.serviceWorker.register('/service.worker.dist.js', { type: 'module' }).catch((e) => {
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
            <CacheProvider value={emotionCache}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <DndProvider backend={HTML5Backend}>
                        <AudioHQApiContext.Provider value={apiClient.current}>
                            <Component {...pageProps} />
                        </AudioHQApiContext.Provider>
                    </DndProvider>
                </ThemeProvider>
            </CacheProvider>
            <ReactQueryDevtools initialIsOpen={true} />
        </PersistQueryClientProvider>
    );
}
