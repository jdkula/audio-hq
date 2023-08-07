/**
 * hooks.ts
 * =========
 * Provides a number of utility hooks for use around the AHQ frontend
 */
import { useState, useEffect, EffectCallback, DependencyList, useCallback, useMemo } from 'react';
import { LocalReactiveValue, useLocalReactiveValue } from '../LocalReactive';

const altLrv = new LocalReactiveValue(false, 10_000);

if (typeof window !== 'undefined') {
    const callback = (ev: KeyboardEvent) => (altLrv.value = ev.altKey);
    document.addEventListener('keydown', callback);
    document.addEventListener('keyup', callback);
}

/** Provides a hook that is true if the alt key is being held down */
export function useAlt(): boolean {
    const [altDown] = useLocalReactiveValue(altLrv);

    return altDown;
}

/** Triggers the given effect on the given interval, or if any of the deps change. */
export function usePeriodicEffect(
    periodMs: number,
    effect: EffectCallback,
    depsIn?: DependencyList,
): ReturnType<typeof useEffect> {
    const [iterator, setIterator] = useState(0);
    const deps = useMemo(() => depsIn ?? [], [depsIn]);

    useEffect(() => {
        const handle = window.setInterval(() => setIterator((n) => n + 1), periodMs);
        return () => window.clearInterval(handle);
    }, [periodMs]);

    return useEffect(effect, [iterator, effect, ...deps]);
}

/** Returns the hash value of the current window (or the empty string) */
export function useHash(): string {
    const [hash, setHash] = useState<string>('');

    const callback = useCallback(() => {
        setHash(window.location.hash);
    }, []);

    useEffect(() => {
        window.addEventListener('hashchange', callback);
        callback();
        return () => window.removeEventListener('hashchange', callback);
    }, [callback]);

    return hash;
}

/** Returns if we are online or not, or null if that information isn't available */
export function useIsOnline(): boolean | null {
    const [isOnline, setIsOnline] = useState<boolean | null>(null);

    const setIsOnlineCallback = useCallback(() => {
        setIsOnline(navigator.onLine ?? null);
    }, []);

    useEffect(() => {
        window.addEventListener('online', setIsOnlineCallback);
        window.addEventListener('offline', setIsOnlineCallback);
        setIsOnlineCallback();
        return () => {
            window.removeEventListener('online', setIsOnlineCallback);
            window.removeEventListener('offline', setIsOnlineCallback);
        };
    }, [setIsOnlineCallback]);

    return isOnline;
}
