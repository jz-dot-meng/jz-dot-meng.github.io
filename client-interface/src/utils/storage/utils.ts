import { REMOTE_CACHE_PREFIX } from "./constants";

export const makeUserDetailsKey = (address: string) =>
    `${REMOTE_CACHE_PREFIX}:user-details:${address}`;
