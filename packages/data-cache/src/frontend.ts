import { getUserAddress, signMessage } from "./tools"; // Import getUserAddress
import { Chain, UserLocalInfo } from "./types"; // Import Chain type explicitly from index
import { ActionCommands, UpdateUserDetailsParams } from "./types/commands";

// Define the return type for the signing functions
interface SignedCommandPayload {
    token: string;
    address: string;
    mode: Chain;
}

/**
 * Internal helper to create a signed token package for a command.
 */
const _signCommandInternal = (
    userLocalInfo: UserLocalInfo,
    command: string,
    params: Record<string, any>,
    expiresInDays?: number
): SignedCommandPayload => {
    // Updated return type
    const statement = JSON.stringify({ command, params });
    const token = signMessage(userLocalInfo, { statement, expiresInDays });
    const address = getUserAddress(userLocalInfo); // Get address
    const mode = userLocalInfo.privateKeyType; // Get mode

    return { token, address, mode }; // Return all parts
};

/**
 * Provides static methods for frontend interactions with the data cache API,
 * handling the signing of commands.
 */
export class DataCacheFrontend {
    /**
     * Creates a signed token package specifically for the "updateUserDetails" command.
     *
     * @param userLocalInfo - The user's local information (key, type).
     * @param params - The user details to update (displayName, pfpUrl).
     * @param expiresInDays - Optional number of days until the token expires.
     * @returns An object containing the base64 token, signer address, and chain mode.
     */
    static handleUpdateUser(
        userLocalInfo: UserLocalInfo,
        params: UpdateUserDetailsParams,
        expiresInDays?: number
    ): SignedCommandPayload {
        // Updated return type
        // Use the constant for the command name
        return _signCommandInternal(
            userLocalInfo,
            ActionCommands.UPDATE_USER_DETAILS,
            params,
            expiresInDays
        );
    }

    // Add other static command handlers here later
    // static handleAddComment(...) { ... }
    // static handleUpdateScore(...) { ... }
}
