/**
 * _app.tsx
 * =========
 * Provides Audio HQ's global styles and CSS variables,
 * plus global <head/> elements.
 * @author Jonathan Kula <jonathan@jdkula.dev>
 */
import { AppProps } from 'next/app';

import Head from 'next/head';

import { ReactElement, useCallback, useEffect, useMemo } from 'react';
import {
    createTheme,
    ThemeProvider as MuiThemeProvider,
    Theme,
    StyledEngineProvider,
    CssBaseline,
    useMediaQuery,
} from '@mui/material';
import StylesProvider from '@mui/styles/StylesProvider';
import { amber, cyan } from '@mui/material/colors';
import '@emotion/react';
import { DefaultTheme } from '@mui/styles';
import { ThemeProvider } from '@emotion/react';
import { Provider } from 'urql';
import { useUrqlClient } from '../lib/urql';
import { useColorMode } from '../lib/utility';

declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}

declare module '@emotion/react' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface Theme extends DefaultTheme {}
}

export default function App({ Component, pageProps }: AppProps): ReactElement {
    const { client } = useUrqlClient();

    // clear Server-Side injected CSS for Material-UI
    useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement?.removeChild(jssStyles);
        }
    }, []);

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [colorMode, setColorMode] = useColorMode();

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: colorMode === 'auto' ? (prefersDarkMode ? 'dark' : 'light') : colorMode,
                    primary: { main: cyan[400], contrastText: '#fff' },
                    secondary: { main: amber.A400 },
                },
                typography: {
                    htmlFontSize: 10,
                    fontSize: 10,
                },
            }),
        [colorMode, prefersDarkMode],
    );

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
        <>
            <StylesProvider injectFirst>
                <StyledEngineProvider injectFirst>
                    <MuiThemeProvider theme={theme}>
                        <ThemeProvider theme={theme}>
                            <Head>
                                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
                                <style>{`
                                html {
                                    font-size: 10pt;
                                }
                            `}</style>

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
        </>
    );
}
