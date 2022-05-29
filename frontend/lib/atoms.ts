import { atom } from 'recoil';

export const pathAtom = atom<string[]>({
    key: 'current_path',
    default: [],
});

export const globalVolumeAtom = atom({
    key: 'global_volume',
    default: 0.2,
});
