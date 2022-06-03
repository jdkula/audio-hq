import { EventEmitter } from 'events';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { get, set } from 'idb-keyval';
import _ from 'lodash';

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

export class LocalIDBReactiveValue<T> extends LocalReactiveValue<T> {
    private _loading = true;
    private _key: string;
    private _defaultValue: T;

    get loading() {
        return this._loading;
    }

    async refresh() {
        const value = (await get(this._key)) ?? this._defaultValue;
        this._loading = false;
        if (!_.isEqual(this.value, value)) {
            this.value = value;
        }
    }

    constructor(key: string, defaultValue: T) {
        super(defaultValue);
        this._key = key;
        this._defaultValue = defaultValue;

        if (typeof window !== 'undefined') {
            this.refresh().then(() => {
                this.on('set', (value) => {
                    set(key, value);
                });
            });
        }
    }
}

export function useLocalReactiveValue<T>(lrv: LocalReactiveValue<T>): [T, Dispatch<SetStateAction<T>>] {
    const [localValue, setValueInternal] = useState(lrv.value);

    useEffect(() => {
        const update = () => {
            setValueInternal(lrv.value);
        };
        lrv.on('set', update);
        update();
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
