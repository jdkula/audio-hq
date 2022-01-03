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
    createTheme,
    ThemeProvider as MuiThemeProvider,
    Theme,
    StyledEngineProvider,
    CssBaseline,
} from '@mui/material';
import StylesProvider from '@mui/styles/StylesProvider';
import { RecoilRoot } from 'recoil';
import { amber, cyan } from '@mui/material/colors';
import '@emotion/react';
import { DefaultTheme } from '@mui/styles';
import { ThemeProvider } from '@emotion/react';

declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}

declare module '@emotion/react' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface Theme extends DefaultTheme {}
}

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
            createTheme({
                palette: {
                    mode: forceDark ? 'dark' : 'light',
                    primary: { main: cyan[400], contrastText: '#fff' },
                    secondary: { main: amber.A400 },
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
                            <RecoilRoot>
                                <Component {...pageProps} />
                            </RecoilRoot>
                        </ThemeProvider>
                    </MuiThemeProvider>
                </StyledEngineProvider>
            </StylesProvider>
        </>
    );
}
