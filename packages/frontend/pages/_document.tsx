/**
 * _document.tsx
 * ==============
 * Helper code that enables styled-componenets
 * to work correctly with SSR.
 */

import Document, { DocumentContext, DocumentInitialProps, Html, Main, NextScript, Head } from 'next/document';
import { resetServerContext } from 'react-beautiful-dnd';
import React, { ReactNode } from 'react';
import createEmotionServer from '@emotion/server/create-instance';
import { createEmotionCache } from '~/lib/ssr';

interface DocumentAdditionalProps {
    emotionStyleTags: ReactNode[];
}

class MyDocument extends Document<DocumentAdditionalProps> {
    render() {
        return (
            <Html lang="en">
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

                    {this.props.emotionStyleTags}
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }

    static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps & DocumentAdditionalProps> {
        resetServerContext();
        const cache = createEmotionCache();
        const { extractCriticalToChunks } = createEmotionServer(cache);
        const originalRenderPage = ctx.renderPage;

        ctx.renderPage = () =>
            originalRenderPage({
                // Too much rigamaroll to tell _document that App accepts an optional emotionCache prop.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                enhanceApp: (App: any) =>
                    function EnhancedApp(props) {
                        return <App emotionCache={cache} {...props} />;
                    },
            });

        const initialProps = await Document.getInitialProps(ctx);

        const emotionStyles = extractCriticalToChunks(initialProps.html);
        const emotionStyleTags = emotionStyles.styles.map((style) => (
            <style
                data-emotion={`${style.key} ${style.ids.join(' ')}`}
                key={style.key}
                dangerouslySetInnerHTML={{ __html: style.css }}
            />
        ));

        return {
            ...initialProps,
            emotionStyleTags,
        };
    }
}

export default MyDocument;
