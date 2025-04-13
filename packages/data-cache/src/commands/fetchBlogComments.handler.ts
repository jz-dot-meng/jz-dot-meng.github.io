import type { Redis } from "ioredis";
import type { CommandHandler } from "../backend";
import { fetchBlogComments } from "../tools/comments";
import type { FetchBlogCommentsParams } from "../types/commands";

/**
 * Command Handler for fetching blog comments with user details.
 *
 * Fetches comments for a specific blog post along with associated user details.
 */
export const fetchBlogCommentsHandler: CommandHandler = async (
    address: string, // Not used for this command, but required by CommandHandler interface
    params: FetchBlogCommentsParams,
    redisClient: Redis
) => {
    // Validate inputs
    if (!params.blogId || typeof params.blogId !== "string") {
        throw new Error("Invalid blogId");
    }

    // Set default values for pagination
    const start = params.start !== undefined ? params.start : 0;
    const count = params.count !== undefined ? params.count : 20;

    console.log(`[fetchBlogCommentsHandler] Fetching comments for blog: ${params.blogId}`);

    try {
        // Use the fetchBlogComments function from tools/comments.ts
        const result = await fetchBlogComments(redisClient, params.blogId, start, count);

        return result;
    } catch (error: any) {
        console.error(
            `[fetchBlogCommentsHandler] Error fetching comments for blog "${params.blogId}":`,
            error
        );
        // Propagate the error to be handled by the main request handler
        throw new Error(`Failed to fetch blog comments: ${error.message || error}`);
    }
};
