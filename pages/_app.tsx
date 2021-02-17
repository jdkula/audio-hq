/**
 * _app.tsx
 * =========
 * Provides Audio HQ's global styles and CSS variables,
 * plus global <head/> elements.
 * @author Jonathan Kula <jonathan@jdkula.dev>
 */
import { AppProps } from 'next/app';

import Head from 'next/head';

import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import {
    createMuiTheme,
    ThemeProvider as MuiThemeProvider,
    CssBaseline,
    StylesProvider,
    useMediaQuery,
} from '@material-ui/core';
import { ThemeProvider } from 'styled-components';
import { RecoilRoot } from 'recoil';
import { amber } from '@material-ui/core/colors';
import { findSourceMap } from 'module';

export default function App({ Component, pageProps }: AppProps): ReactElement {
    // clear Server-Side injected CSS for Material-UI
    useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement?.removeChild(jssStyles);
        }
    }, []);

    const [forceDark, setForceDark] = useState(false);

    // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const prefersDarkMode = false;

    const theme = useMemo(
        () =>
            createMuiTheme({
                palette: {
                    type: forceDark ? 'dark' : 'light',
                    primary: { main: '#4fd2d6', contrastText: '#fff' },
                    secondary: amber,
                },
                typography: {
                    htmlFontSize: 10,
                    fontSize: 10,
                },
            }),
        [prefersDarkMode, forceDark],
    );

    const forceModeListener = useCallback(
        (ev: KeyboardEvent) => {
            if (ev.code === 'KeyM' && (ev.ctrlKey || ev.metaKey)) {
                ev.preventDefault();
                setForceDark(!forceDark);
            }
        },
        [forceDark, setForceDark],
    );

    useEffect(() => {
        window.addEventListener('keydown', forceModeListener);
        return () => window.removeEventListener('keydown', forceModeListener);
    }, [forceModeListener]);

    return (
        <>
            <StylesProvider injectFirst>
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
                        <RecoilRoot>
                            <Component {...pageProps} />
                        </RecoilRoot>
                    </ThemeProvider>
                </MuiThemeProvider>
            </StylesProvider>
        </>
    );
}
