import { amber, cyan } from '@mui/material/colors';

import { DefaultTheme } from '@mui/styles';
import { ThemeProvider } from '@emotion/react';
import { createTheme, Theme, ThemeOptions } from '@mui/material';

declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}

declare module '@emotion/react' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface Theme extends DefaultTheme {}
}

export const ahqThemeBase: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: { main: cyan[400], contrastText: '#fff' },
        secondary: { main: amber.A400 },
    },
};
