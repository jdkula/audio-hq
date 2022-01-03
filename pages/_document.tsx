/**
 * _document.tsx
 * ==============
 * Helper code that enables styled-componenets
 * to work correctly with SSR.
 */

import Document, { DocumentContext, DocumentInitialProps } from 'next/document';
import { resetServerContext } from 'react-beautiful-dnd';
import React from 'react';
import ServerStyleSheets from '@mui/styles/ServerStyleSheets';

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
        const muiSheets = new ServerStyleSheets();
        resetServerContext();
        const originalRenderPage = ctx.renderPage;

        ctx.renderPage = () =>
            originalRenderPage({
                enhanceApp: (App) => (props) => muiSheets.collect(<App {...props} />),
            });

        const initialProps = await Document.getInitialProps(ctx);
        return {
            ...initialProps,
            styles: (
                <>
                    {initialProps.styles}
                    {muiSheets.getStyleElement()}
                </>
            ),
        };
    }
}

export default MyDocument;
