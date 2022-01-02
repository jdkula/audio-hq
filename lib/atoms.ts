import { atom } from 'recoil';
import { SfxState } from './Workspace';
import { Set } from 'immutable';

export const pathAtom = atom<string[]>({
    key: 'current_path',
    default: [],
});

export const globalVolumeAtom = atom({
    key: 'global_volume',
    default: 0.2,
});

export const sfxAtom = atom<SfxState | null>({
    key: 'current_sfx',
    default: null,
});

export const favoritesAtom = atom<Set<string>>({
    key: 'favorites_set',
    default: Set(),
});
