export const isDefined = <T>(t: T | undefined): t is NonNullable<T> => {
    return !!t
}