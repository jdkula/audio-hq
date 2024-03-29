import { amber, cyan } from '@mui/material/colors';

import { Theme, ThemeOptions } from '@mui/material';
import { DefaultTheme } from '@mui/system';

declare module '@mui/system' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}

declare module '@emotion/react' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface Theme extends DefaultTheme {}
}

export const ahqThemeBase: ThemeOptions = {
    palette: {
        primary: { main: cyan[400], contrastText: '#fff' },
        secondary: { main: amber.A400 },
    },
};
