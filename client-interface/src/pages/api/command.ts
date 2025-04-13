import cors from "@utils/wrappers/cors"; // Use default import
import { ActionCommands, Chain, updateUserDetailsHandler } from "data-cache"; // Import types/handlers/constants from main entry
import { DataCacheBackend } from "data-cache/backend"; // Import backend class from subpath
import Redis from "ioredis";
import type { NextApiRequest, NextApiResponse } from "next";

// --- Redis Client Initialization ---
// It's generally better to initialize the client outside the handler function
// to reuse the connection across requests.
let redisClient: Redis | null = null;

function getRedisClient(): Redis {
    if (!redisClient) {
        const redisHost = process.env.REDIS_HOST;
        const redisPort = process.env.REDIS_PORT;
        const redisUsername = process.env.REDIS_USERNAME || "default";
        const redisPassword = process.env.REDIS_PASSWORD;
        if (!redisHost || !redisPort || !redisPassword) {
            console.error(
                "FATAL: REDIS_HOST, REDIS_PORT or REDIS_PASSWORD environment variable is not set."
            );
            // In a real app, you might throw or handle this more gracefully
            // For now, we'll attempt a default connection but log a severe warning.
            // throw new Error("REDIS_URL environment variable is not set.");
            console.warn(
                "Attempting default Redis connection (redis://localhost:6379) due to missing REDIS_URL."
            );
            redisClient = new Redis(); // Default connection
        } else {
            redisClient = new Redis(parseInt(redisPort), redisHost, {
                username: redisUsername,
                password: redisPassword,
                maxRetriesPerRequest: 3,
                lazyConnect: true, // Connect explicitly if needed or let ioredis handle it
            });
        }

        redisClient.on("connect", () => console.log("API Route: Connected to Redis"));
        redisClient.on("error", (err) => console.error("API Route: Redis Client Error", err));
        // Consider explicit connect if lazyConnect is true and needed immediately
        // redisClient.connect().catch(console.error);
    }
    return redisClient;
}

// --- Backend Initialization ---
// Initialize backend outside handler to reuse instance and registry
let dataCacheBackend: DataCacheBackend | null = null;

function getBackendInstance(): DataCacheBackend {
    if (!dataCacheBackend) {
        const client = getRedisClient();
        dataCacheBackend = new DataCacheBackend(client);
        // Register command handlers
        dataCacheBackend.registerCommand(
            ActionCommands.UPDATE_USER_DETAILS,
            updateUserDetailsHandler
        );
        // Register other commands here
        console.log("API Route: DataCacheBackend initialized and commands registered.");
    }
    return dataCacheBackend;
}

// --- API Handler ---
async function handler(req: NextApiRequest, res: NextApiResponse) {
    // console.log("[/api/command] Received request body:", JSON.stringify(req.body, null, 2)); // <-- Log incoming body
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { token, address, mode } = JSON.parse(req.body) || {}; // Add default empty object for safety

    // Basic validation
    if (!token || typeof token !== "string") {
        return res.status(400).json({ success: false, error: "Missing or invalid token" });
    }
    if (!address || typeof address !== "string") {
        return res.status(400).json({ success: false, error: "Missing or invalid address" });
    }
    // TODO: Add proper validation for 'mode' against the Chain enum values
    if (!mode || (mode !== "evm" && mode !== "svm")) {
        return res.status(400).json({ success: false, error: "Missing or invalid mode" });
    }

    try {
        const backend = getBackendInstance();
        const result = await backend.handleRequest(token, address, mode as Chain);
        return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        console.error(`API Error in /api/command for address ${address}:`, error.message || error);
        // Provide a generic error message to the client
        return res
            .status(500)
            .json({ success: false, error: error.message || "Internal server error" });
    }
}

export default cors(handler); // Apply CORS wrapper if needed
