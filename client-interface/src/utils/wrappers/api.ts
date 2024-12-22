import { errorParseToString } from "@utils/functions/object";
import { ErrorResponse } from "@utils/types/api";

const getBaseUrl = (): string => {
    if (process.env.NODE_ENV === "development") {
        // console.log("is dev!");
        return "";
    } else {
        return "https://jz-dot-meng.vercel.app";
    }
};

export const api = async <T>(partialUrl: string, body?: any): Promise<T | ErrorResponse> => {
    const fullUrl = `${getBaseUrl()}${partialUrl}`;
    return fetch(fullUrl, {
        body: JSON.stringify(body),
        referrerPolicy: "strict-origin-when-cross-origin",
        method: body ? "POST" : "GET",
    })
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
