import * as React from 'react';
import ThemeRegistry from './ThemeRegistry';
import AppRootClient from './AppRootClient';
import ClientOnly from './ClientOnly';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body>
                <ClientOnly>
                    <ThemeRegistry>
                        <AppRootClient>{children}</AppRootClient>
                    </ThemeRegistry>
                </ClientOnly>
            </body>
        </html>
    );
}
