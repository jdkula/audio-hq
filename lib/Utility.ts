import PropTypes from "prop-types";

export type Update<T> = Partial<T> | ((old: T) => T);

export function applyUpdate<T>(old: T, update: Update<T>): T {
    let newT: T;
    if (typeof update === "function") {
        newT = update(old);
    } else {
        newT = Object.assign(old ?? {}, update);
    }

    return newT;
}

export function noProps(): undefined {
    return undefined;
}

export function props<PT>(props: PT): () => PT {
    return () => props;
}

export function functionalComponent<PT>(
    getPropTypes: (propTypes: typeof PropTypes) => PT,
    component: React.FunctionComponent<PropTypes.InferProps<PT>>,
): React.FunctionComponent<PropTypes.InferProps<PT>> {
    component.propTypes = getPropTypes(PropTypes);
    return component;
}
