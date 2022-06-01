import { EventEmitter } from 'events';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';

export class LocalReactiveValue<T> extends EventEmitter {
    private _value: T;

    constructor(defaultValue: T, maxListeners = 10000) {
        super();
        this.setMaxListeners(maxListeners);
        this._value = defaultValue;
    }

    set value(value: T) {
        this._value = value;
        this.emit('set', value);
    }

    get value(): T {
        return this._value;
    }
}

export class LocalStorageReactiveValue<T> extends LocalReactiveValue<T> {
    constructor(key: string, defaultValue: T) {
        super(
            typeof window === 'undefined'
                ? defaultValue
                : JSON.parse(localStorage.getItem(key) ?? 'null') ?? defaultValue,
        );
        this.on('set', (value) => {
            localStorage.setItem(key, JSON.stringify(value));
        });
    }
}

export function useLocalReactiveValue<T>(lrv: LocalReactiveValue<T>): [T, Dispatch<SetStateAction<T>>] {
    const [localValue, setValueInternal] = useState(lrv.value);

    useEffect(() => {
        const update = () => {
            setValueInternal(lrv.value);
        };
        update();
        lrv.on('set', update);
        return () => {
            lrv.off('set', update);
        };
    }, [lrv]);

    const setValue = useCallback(
        (newValue: SetStateAction<T>) => {
            lrv.value = newValue instanceof Function ? newValue(lrv.value) : newValue;
        },
        [lrv],
    );

    return [localValue, setValue];
}
