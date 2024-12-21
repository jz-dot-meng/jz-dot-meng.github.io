import { TSchema } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

// wrapper to
export class LocalStorage {
    // overloads
    static getItem<T>(key: string, type: TSchema): T | undefined;
    static getItem(key: string): string | undefined;
    static getItem<T>(key: string, type?: TSchema): T | string | undefined {
        try {
            const storedItem = localStorage.getItem(key);
            if (!storedItem) return undefined;
            const isNullOrUndefined =
                storedItem === "undefined" || storedItem === '""' || storedItem === null;
            if (isNullOrUndefined) return undefined;
            if (type) {
                try {
                    return Value.Parse(type, JSON.parse(storedItem));
                } catch (e) {
                    console.error(e);
                    return undefined;
                }
            } else {
                return storedItem;
            }
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }

    static setItem<T>(key: string, value: T): void {
        try {
            const stringified = JSON.stringify(value);
            localStorage.setItem(key, stringified);
        } catch (e) {
            console.error(e);
        }
    }
}
