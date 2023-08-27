import { errorParseToString } from "@utils/functions/object";
import { ErrorResponse } from "@utils/types/api";

export const api = async <T>(url: string): Promise<T | ErrorResponse> => {
    return fetch(url, { referrerPolicy: "strict-origin-when-cross-origin" })
        .then(async (r) => {
            if (!r.ok) {
                let error = `${r.status} ${r.statusText}`;
                try {
                    const parsed = (await r.json()) as ErrorResponse;
                    error = parsed.error;
                } catch (err) {
                    // not a server response, internal fetch error
                }
                return { success: false, error } as ErrorResponse;
            }
            return r.json() as T;
        })
        .catch((err) => {
            const error = errorParseToString(err);
            return { success: false, error } as ErrorResponse;
        });
};
