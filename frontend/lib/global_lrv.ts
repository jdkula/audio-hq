import { LocalIDBReactiveValue, LocalStorageReactiveValue } from './local_reactive';

export const currentPathLRV = new LocalStorageReactiveValue<string[]>('current_path', []);
export const globalVolumeLRV = new LocalStorageReactiveValue<number>('global_volume', 0.2);
export const shouldCacheLRV = new LocalIDBReactiveValue<boolean>('should_cache', false);
