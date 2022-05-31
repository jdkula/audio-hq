import { LocalReactiveValue } from './local_reactive';

export const currentPathLRV = new LocalReactiveValue<string[]>([]);
export const globalVolumeLRV = new LocalReactiveValue<number>(0.2);
