import { useCallback, useEffect, useState } from 'react';

const kColorModeKey = '__AHQ_SAVED_COLOR_MODE';

export type ColorMode = 'auto' | 'light' | 'dark';
type ColorModeHook = [mode: ColorMode, setColorMode: (cm: ColorMode) => void];

export default function useColorMode(): ColorModeHook {
    const [colorMode, setColorMode] = useState<ColorMode>('auto');

    useEffect(() => {
        setColorMode((window.localStorage.getItem(kColorModeKey) as ColorMode) ?? 'auto');
        if (window.__AHQ_COLOR_MODE_LISTENERS === undefined) {
            window.__AHQ_COLOR_MODE_LISTENERS = [];
        }

        window.__AHQ_COLOR_MODE_LISTENERS.push(setColorMode);
        return () => {
            const idx = window.__AHQ_COLOR_MODE_LISTENERS.indexOf(setColorMode);
            window.__AHQ_COLOR_MODE_LISTENERS.splice(idx, 1);
        };
    }, [setColorMode]);

    const setGlobalColorMode = useCallback((cm: ColorMode) => {
        window.localStorage.setItem(kColorModeKey, cm);
        for (const listener of window.__AHQ_COLOR_MODE_LISTENERS ?? []) {
            listener(cm);
        }
    }, []);

    return [colorMode, setGlobalColorMode];
}
