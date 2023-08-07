'use client';

import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import NextAppDirEmotionCacheProvider from './EmotionCache';
import { ahqThemeBase } from '~/lib/theme';
import { useMediaQuery } from '@mui/material';
import { useColorMode } from '~/lib/utility/usePersistentData';

//https://github.com/mui/material-ui/blob/b5aec0120fea96989f09ee40be247a1860dcd785/examples/material-ui-nextjs-ts/src/components/ThemeRegistry/ThemeRegistry.tsx
export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
    // Set up theming
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [colorMode, setColorMode] = useColorMode();
    const theme = React.useMemo(() => {
        const copy = JSON.parse(JSON.stringify(ahqThemeBase));
        copy.palette.mode = colorMode === 'auto' ? (prefersDarkMode ? 'dark' : 'light') : colorMode;
        return createTheme(copy);
    }, [colorMode, prefersDarkMode]);

    // <-- Press Alt/Opt+M to change color mode -->
    const forceModeListener = React.useCallback(
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

    React.useEffect(() => {
        window.addEventListener('keydown', forceModeListener);
        return () => window.removeEventListener('keydown', forceModeListener);
    }, [forceModeListener]);

    return (
        <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
            <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                {children}
            </ThemeProvider>
        </NextAppDirEmotionCacheProvider>
    );
}
