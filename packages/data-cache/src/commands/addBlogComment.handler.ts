import type { Redis } from "ioredis";
import { v4 as uuidv4 } from "uuid";
import type { CommandHandler } from "../backend";
import type { AddBlogCommentParams } from "../types/commands";

/**
 * Generates a unique ID for a comment
 */
function generateCommentId(address: string): string {
    const timestamp = Date.now().toString(36);
    const uuid = uuidv4().split("-")[0];
    return `${timestamp}-${address}-${uuid}`;
}

/**
 * Command Handler for adding a blog comment in Redis.
 *
 * Creates a comment hash at `comment:{commentId}` with the comment data
 * and adds the commentId to the blog's comments sorted set at `blog:{blogId}:comments`
 */
export const addBlogCommentHandler: CommandHandler = async (
    address: string,
    params: AddBlogCommentParams,
    redisClient: Redis
) => {
    // Validate inputs
    if (!params.blogId || typeof params.blogId !== "string") {
        throw new Error("Invalid blogId");
    }

    if (!params.comment || typeof params.comment !== "string" || params.comment.trim() === "") {
        throw new Error("Comment cannot be empty");
    }

    console.log(
        `[addBlogCommentHandler] Adding comment for blog: ${params.blogId} from address: ${address}`
    );

    // Generate a unique comment ID
    const commentId = generateCommentId(address);

    // Get current timestamp (will be used as score in the sorted set)
    const createdTime = Date.now();

    // Create the comment hash key
    const commentKey = `comment:${commentId}`;

    // Create the blog comments sorted set key
    const blogCommentsKey = `blog:${params.blogId}:comments`;

    try {
        // Use a transaction to ensure both operations succeed or fail together
        const pipeline = redisClient.pipeline();

        // Create the comment hash with all fields
        pipeline.hset(commentKey, {
            address,
            comment: params.comment,
            createdTime: createdTime.toString(),
            blogId: params.blogId,
            // parentId field would be added here for replies in the future
        });

        // Add the comment ID to the blog's comments sorted set with timestamp as score
        pipeline.zadd(blogCommentsKey, createdTime, commentId);

        // Execute both commands
        const results = await pipeline.exec();
        console.log(`[addBlogCommentHandler] Redis pipeline results:`, results);

        return commentId;
    } catch (error: any) {
        console.error(
            `[addBlogCommentHandler] Error adding comment for blog "${params.blogId}":`,
            error
        );
        // Propagate the error to be handled by the main request handler
        throw new Error(`Failed to add blog comment: ${error.message || error}`);
    }
};
