/**
 * ssr.ts
 * =======
 * SSR helpers
 */
import createCache from '@emotion/cache';

/** Creates a new Emotion cache for css */
export function createEmotionCache() {
    return createCache({ key: 'css', prepend: true });
}
