import { EventEmitter } from 'events';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';

export class LocalReactiveValue<T> extends EventEmitter {
    private _value: T;

    constructor(defaultValue: T) {
        super();
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
