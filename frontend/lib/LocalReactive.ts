/**
 * LocalReactive.ts
 * ==================
 * Provides classes and hooks for LocalReactiveValues, which
 * will be reactively updated anywhere that is listening for them.
 */
import { EventEmitter } from 'events';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { get, set } from 'idb-keyval';
import _ from 'lodash';

/**
 * Provides a transient local reactive value of a given type
 *
 * You can listen on the 'set' event to be updated of new data.
 */
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

/**
 * Provides a transient local reactive value of a given type,
 * which is replicated to local storage
 *
 * You can listen on the 'set' event to be updated of new data.
 */
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

/**
 * Provides a transient local reactive value of a given type,
 * which is replicated to IndexedDB using idb-keyval
 *
 * You can listen on the 'set' event to be updated of new data.
 */
export class LocalIDBReactiveValue<T> extends LocalReactiveValue<T> {
    private _loading = true;
    private _key: string;
    private _defaultValue: T;

    /** Returns true if we are retrieving the initial value */
    get loading() {
        return this._loading;
    }

    /** Refreshes this value from IndexedDB */
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

/**
 * Provides a hook that gives a useState-like API for using reactive values.
 */
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
