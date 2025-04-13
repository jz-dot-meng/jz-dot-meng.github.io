import type { Redis } from "ioredis";
import type { CommandHandler } from "../backend"; // Adjust path if backend.ts is moved/renamed
import type { UpdateUserDetailsParams } from "../types/commands";

/**
 * Command Handler for updating user details in Redis.
 *
 * Updates the `displayName` and/or `pfpUrl` fields in a Redis hash
 * keyed by `user:{address}:details`. Also sets a `lastUpdated` timestamp.
 */
export const updateUserDetailsHandler: CommandHandler = async (
    address: string,
    params: UpdateUserDetailsParams, // Use the specific type
    redisClient: Redis
): Promise<{ success: boolean }> => {
    const redisKey = `user:${address}:details`;
    const dataToUpdate: Record<string, string> = {};

    console.log(`[updateUserDetailsHandler] Updating details for address: ${address}`);
    console.log(`[updateUserDetailsHandler] Received params:`, params);

    // Build the hash fields to update, only including provided values
    if (params.displayName !== undefined) {
        dataToUpdate.displayName = params.displayName;
    }
    if (params.pfpUrl !== undefined) {
        dataToUpdate.pfpUrl = params.pfpUrl;
    }

    // Add a timestamp for the update
    dataToUpdate.lastUpdated = new Date().toISOString();

    if (Object.keys(dataToUpdate).length <= 1) {
        // Only lastUpdated if no params provided
        console.log("[updateUserDetailsHandler] No details provided to update.");
        // Still return success, as the request was valid, just didn't change anything.
        // Or potentially return a specific status/message? For now, success.
        return { success: true };
    }

    try {
        console.log(`[updateUserDetailsHandler] Writing to Redis key "${redisKey}":`, dataToUpdate);
        // Use HSET to set multiple fields in the hash
        const result = await redisClient.hset(redisKey, dataToUpdate);
        console.log(`[updateUserDetailsHandler] Redis HSET result: ${result}`); // result is the number of fields added (not updated)

        return { success: true };
    } catch (error: any) {
        console.error(
            `[updateUserDetailsHandler] Error writing to Redis for key "${redisKey}":`,
            error
        );
        // Propagate the error to be handled by the main request handler
        throw new Error(`Failed to update user details in cache: ${error.message || error}`);
    }
};
