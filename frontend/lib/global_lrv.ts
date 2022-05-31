import { LocalReactiveValue, LocalStorageReactiveValue } from './local_reactive';

export const currentPathLRV = new LocalReactiveValue<string[]>([]);
export const globalVolumeLRV = new LocalStorageReactiveValue<number>('global_volume', 0.2);
