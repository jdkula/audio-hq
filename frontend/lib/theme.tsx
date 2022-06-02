import { amber, cyan } from '@mui/material/colors';

import { Theme, ThemeOptions } from '@mui/material';
import { DefaultTheme } from '@mui/styles';

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
