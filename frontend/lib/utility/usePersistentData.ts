/**
 * usePersistentData.ts
 * ======================
 * Contains hooks that give access to persisted data used in the frontend.
 */
import { useCallback, useContext } from 'react';
import { kColorModeKey, kDefaultVolume, kGlobalVolumeKey, kMaxRecents, kRecentsKey } from '../constants';
import { LocalStorageReactiveValue, useLocalReactiveValue } from '../LocalReactive';
import { WorkspaceLRVContext } from './context';

// <== Color Mode ==>
export type ColorMode = 'auto' | 'light' | 'dark';
export const colorModeLRV = new LocalStorageReactiveValue<ColorMode>(kColorModeKey, 'auto');
export function useColorMode() {
    return useLocalReactiveValue(colorModeLRV);
}

// <== Favorites ==>
interface Favorites {
    favorites: string[];
    removeFavorite: (id: string) => void;
    addFavorite: (id: string) => void;
}

export function useFavorites(): Favorites {
    const { favorites: favoritesLRV } = useContext(WorkspaceLRVContext);
    const [favorites, setFavorites] = useLocalReactiveValue(favoritesLRV);

    return {
        favorites,
        removeFavorite: (id) => setFavorites((s) => s.filter((fav) => fav !== id)),
        addFavorite: (id) => setFavorites((s) => [...s.filter((fav) => fav !== id), id]),
    };
}

// <== Recents ==>
type LocalRecents = [recents: string[], addRecent: (workspace: string) => void];
export const localRecentsLRV = new LocalStorageReactiveValue<string[]>(kRecentsKey, []);

export function useLocalRecents(): LocalRecents {
    const [recents, setRecentsInternal] = useLocalReactiveValue(localRecentsLRV);

    const setRecents = useCallback(
        (workspace: string) =>
            setRecentsInternal((recents) =>
                [workspace, ...(recents ?? []).filter((ws) => ws !== workspace)].slice(0, kMaxRecents),
            ),
        [setRecentsInternal],
    );

    return [recents ?? [], setRecents];
}

// <== Global Volume ==>
export const globalVolumeLRV = new LocalStorageReactiveValue<number>(kGlobalVolumeKey, kDefaultVolume);

export function useGlobalVolume() {
    return useLocalReactiveValue(globalVolumeLRV);
}
