import { UserRemoteInfo } from "data-cache";
import { DATA_SEPARATOR, REMOTE_CACHE_PREFIX } from "./constants";

export const makeUserDetailsKey = (address: string) =>
    `${REMOTE_CACHE_PREFIX}:user-details:${address}`;

export const makeUserDetailsKeyWithWriteData = (address: string, userDetails: UserRemoteInfo) =>
    `${makeUserDetailsKey(address)}${DATA_SEPARATOR}${JSON.stringify(userDetails)}`;
