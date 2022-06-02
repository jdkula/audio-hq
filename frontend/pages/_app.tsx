/**
 * _app.tsx
 * =========
 * Provides Audio HQ's global styles and CSS variables,
 * plus global <head/> elements.
 *
 * @author Jonathan Kula <jonathan@jdkula.dev>
 */

import '@emotion/react';

import {
    CssBaseline,
    ThemeProvider as MuiThemeProvider,
    StyledEngineProvider,
    ThemeProvider,
    createTheme,
    useMediaQuery,
} from '@mui/material';
import { ReactElement, useCallback, useEffect, useMemo } from 'react';

import Head from 'next/head';
import StylesProvider from '@mui/styles/StylesProvider';

import { AppProps } from 'next/app';
import { Provider } from 'urql';
import { ahqThemeBase } from '~/lib/theme';
import { deepmerge } from '@mui/utils';
import { useColorMode } from '../lib/utility';
import { useUrqlClient } from '../lib/urql';

export default function App({ Component, pageProps }: AppProps): ReactElement {
    const { client } = useUrqlClient();

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

    return (
        <StylesProvider injectFirst>
            <StyledEngineProvider injectFirst>
                <MuiThemeProvider theme={theme}>
                    <ThemeProvider theme={theme}>
                        <Head>
                            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

                            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                            <link rel="manifest" href="/site.webmanifest" />
                            <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
                            <meta name="apple-mobile-web-app-title" content="Audio HQ" />
                            <meta name="application-name" content="Audio HQ" />
                            <meta name="msapplication-TileColor" content="#2b5797" />
                            <meta name="theme-color" content="#ffffff" />
                        </Head>
                        <CssBaseline />
                        <Provider value={client}>
                            <Component {...pageProps} />
                        </Provider>
                    </ThemeProvider>
                </MuiThemeProvider>
            </StyledEngineProvider>
        </StylesProvider>
    );
}
