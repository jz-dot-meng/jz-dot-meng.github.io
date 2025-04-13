import Redis from "ioredis";
import { validateToken } from "./tools"; // Assuming validateToken is exported from ./tools/index.ts or ./tools/validation.ts
import { Chain } from "./types"; // Assuming Chain is exported from ./type/index.ts or ./type/user.ts

// Existing BackendCache class (keep as is for now)
export class BackendCache {
    // TODO: abstract cache away from this class
    readonly _cache: Redis;

    constructor(
        host: string | undefined,
        port: string | undefined,
        username: string | undefined,
        password: string | undefined
    ) {
        this._cache = new Redis({
            host: host ?? "127.0.0.1",
            port: port ? parseInt(port) : 6379,
            username,
            password,
        });
    }
}

// --- New DataCacheBackend Implementation ---

// Define the structure for command handlers
export type CommandHandler = (
    address: string,
    params: any, // Use a more specific type later (e.g., based on command)
    redisClient: Redis
) => Promise<any>; // Return type can be more specific

export class DataCacheBackend {
    private commandRegistry: Map<string, CommandHandler>;
    private redisClient: Redis;

    /**
     * Creates an instance of DataCacheBackend.
     * @param redisClient A pre-configured ioredis client instance.
     */
    constructor(redisClient: Redis) {
        this.redisClient = redisClient;
        this.commandRegistry = new Map<string, CommandHandler>();
        console.log("DataCacheBackend initialized."); // Added log
    }

    /**
     * Registers a handler function for a specific command name.
     * @param commandName The name of the command (e.g., "updateUserDetails").
     * @param handler The function to execute for this command.
     */
    registerCommand(commandName: string, handler: CommandHandler): void {
        if (this.commandRegistry.has(commandName)) {
            console.warn(`Command "${commandName}" is already registered. Overwriting.`);
        }
        this.commandRegistry.set(commandName, handler);
        console.log(`Command "${commandName}" registered.`); // Added log
    }

    /**
     * Handles an incoming request token, validates it, parses the command,
     * and executes the corresponding registered handler.
     * @param token The base64 encoded token containing the signed message.
     * @param address The expected signer address.
     * @param mode The chain type (evm or svm).
     * @returns The result from the executed command handler.
     */
    async handleRequest(token: string, address: string, mode: Chain): Promise<any> {
        console.log(`Handling request for address: ${address}, mode: ${mode}`); // Added log
        try {
            // 1. Validate the token and signature
            const parsedBody = validateToken(mode, address, token);
            console.log("Token validated successfully."); // Added log

            // 2. Parse the command and parameters from the statement
            if (!parsedBody.statement) {
                throw new Error("Validated token body does not contain a statement.");
            }

            let commandData: { command: string; params: any };
            try {
                commandData = JSON.parse(parsedBody.statement);
                if (
                    typeof commandData !== "object" ||
                    commandData === null ||
                    typeof commandData.command !== "string"
                ) {
                    throw new Error("Statement JSON is not a valid command object.");
                }
                console.log(`Parsed command: ${commandData.command}`, commandData.params); // Added log
            } catch (e) {
                console.error("Failed to parse statement JSON:", e);
                throw new Error("Failed to parse command from statement.");
            }

            const { command, params } = commandData;

            // 3. Look up the handler
            const handler = this.commandRegistry.get(command);
            if (!handler) {
                console.error(`No handler registered for command: ${command}`); // Added log
                throw new Error(`Unknown command: ${command}`);
            }

            // 4. Execute the handler
            console.log(`Executing handler for command: ${command}`); // Added log
            const result = await handler(address, params, this.redisClient);
            console.log(`Handler for command "${command}" executed successfully.`); // Added log
            return result;
        } catch (error: any) {
            console.error("Error handling request:", error.message || error); // Added log
            // Re-throw the error to be handled by the API route
            throw error;
        }
    }
}
