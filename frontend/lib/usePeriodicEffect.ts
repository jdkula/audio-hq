import { DependencyList, EffectCallback, useEffect, useState } from 'react';

export default function usePeriodicEffect(
    periodMs: number,
    effect: EffectCallback,
    deps?: DependencyList,
): ReturnType<typeof useEffect> {
    const [iterator, setIterator] = useState(0);
    useEffect(() => {
        const handle = window.setInterval(() => setIterator((n) => n + 1), periodMs);
        return () => window.clearInterval(handle);
    }, [periodMs]);

    return useEffect(effect, [iterator, ...(deps ?? [])]);
}
