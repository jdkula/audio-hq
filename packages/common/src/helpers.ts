// https://stackoverflow.com/questions/58954642/remove-null-from-interface-properties
export type NoNullableFieldsRecursive<ObjectType, Exclude = never> = {
    [K in keyof ObjectType]-?: ObjectType[K] extends Exclude
        ? ObjectType[K]
        : ObjectType[K] extends object
        ? NoNullableFieldsRecursive<ObjectType[K], Exclude>
        : NonNullable<ObjectType[K]>;
};

export type NonNullableRecursive<AnyType, Exclude = never> = AnyType extends Exclude
    ? AnyType
    : NonNullable<AnyType extends object ? NoNullableFieldsRecursive<AnyType, Exclude> : AnyType>;

export type SelectNonNullable<T, K extends keyof T = keyof T, Exclude = never> = {
    [P in keyof T]-?: P extends K ? NonNullableRecursive<T[P], Exclude> : T[P];
};

export type RequiredRecursive<T> = T extends object
    ? {
          [P in keyof T]-?: T[P] extends object ? RequiredRecursive<T[P]> : T[P];
      }
    : T;

export type SelectRequired<T, K extends keyof T> = {
    [P in K]-?: RequiredRecursive<T[P]>;
} & {
    [P in Exclude<keyof T, K>]?: T[P];
};
