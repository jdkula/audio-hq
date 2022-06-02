import { LocalStorageReactiveValue } from './local_reactive';

export const currentPathLRV = new LocalStorageReactiveValue<string[]>('current_path', []);
export const globalVolumeLRV = new LocalStorageReactiveValue<number>('global_volume', 0.2);
export const doCacheLRV = new LocalStorageReactiveValue<boolean>('do_cache', true);
