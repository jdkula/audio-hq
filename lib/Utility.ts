export function applyUpdate<T>(old: T, update: Partial<T>, def: T): T {
    let newT: T;
    if (old === null) {
        const copy = Object.assign({}, def); // can't say "= null" here; type error.
        newT = Object.assign(copy, update);
    } else if (update === null) {
        newT = update; // can't say "= null" here; type error.
    } else {
        newT = Object.assign(old, update);
    }

    return newT;
}
