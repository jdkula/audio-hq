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
import { ReactElement, useCallback, useEffect, useMemo } from 'react';

import { AppProps } from 'next/app';
import { Provider } from 'urql';
import { ahqThemeBase } from '~/lib/theme';
import { deepmerge } from '@mui/utils';
import { createEmotionCache, useColorMode } from '../lib/utility';
import { useUrqlClient } from '../lib/urql';
import { CacheProvider, EmotionCache } from '@emotion/react';

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
    const { client } = useUrqlClient();

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
        navigator.serviceWorker.register('/service.worker.js')
    }, [])

    return (
        <CacheProvider value={emotionCache}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Provider value={client}>
                    <Component {...pageProps} />
                </Provider>
            </ThemeProvider>
        </CacheProvider>
    );
}
