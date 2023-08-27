export const errorParseToString = (err: unknown): string => {
    if (typeof err === "string") return err;
    if (err instanceof Error) return err.message;
    return JSON.stringify(err, Object.getOwnPropertyNames(err));
};
