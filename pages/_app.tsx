/**
 * _app.tsx
 * =========
 * Provides Audio HQ's global styles and CSS variables,
 * plus global <head/> elements.
 * @author Jonathan Kula <jonathan@jdkula.dev>
 */
import { AppProps } from 'next/app';

import Head from 'next/head';

import { ReactElement, useEffect } from 'react';
import { createMuiTheme, ThemeProvider as MuiThemeProvider, CssBaseline, StylesProvider } from '@material-ui/core';
import { ThemeProvider } from 'styled-components';
import { RecoilRoot } from 'recoil';

const theme = createMuiTheme({
    typography: {
        htmlFontSize: 10,
        fontSize: 10,
    },
});

export default function App({ Component, pageProps }: AppProps): ReactElement {
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
