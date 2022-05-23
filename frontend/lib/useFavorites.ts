import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { favoritesAtom } from './atoms';
import { Set } from 'immutable';

interface Favorites {
    favorites: Set<string>;
    removeFavorite: (id: string) => void;
    addFavorite: (id: string) => void;
}

const kFavoriteKey = '__AHQ_FAVORITES';

export default function useFavorites(): Favorites {
    const [favorites, setFavorites] = useRecoilState(favoritesAtom);

    useEffect(() => {
        if (!window.__AHQ_LOADED_FAVORITES) {
            window.__AHQ_LOADED_FAVORITES = true;
            setFavorites(Set(JSON.parse(localStorage.getItem(kFavoriteKey) ?? '[]')));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(kFavoriteKey, JSON.stringify(favorites.toArray()));
    }, [favorites]);

    return {
        favorites,
        removeFavorite: (id) => setFavorites((s) => s.add(id)),
        addFavorite: (id) => setFavorites((s) => s.remove(id)),
    };
}
