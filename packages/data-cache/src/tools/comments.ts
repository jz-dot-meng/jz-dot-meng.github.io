import type { Redis } from "ioredis";
import { UserRemoteInfo } from "../types";
import { BasicComment, CommentWithUserDetails } from "../types/blogs";

/**
 * Lua script for fetching blog comments with user details
 */
const fetchBlogCommentsScript = `
-- KEYS[1]: blog comment ZSET key (e.g., blog:my-post-id:comments)
-- ARGV[1]: Start index (e.g., 0)
-- ARGV[2]: End index (e.g., 19)

local commentIndexKey = KEYS[1]
local startIndex = tonumber(ARGV[1])
local endIndex = tonumber(ARGV[2])

-- Fetch comment IDs with scores (timestamps)
local commentIdsWithScores = redis.call('ZRANGE', commentIndexKey, startIndex, endIndex, 'WITHSCORES', 'REV')

local results = {}
local commentDataMap = {} -- Temp map { commentId -> { commentData } }
local userDetailKeysToFetch = {} -- Set of user detail keys needed { ['user:addr1:details'] = true, ... }
local addressesFound = {} -- Set of addresses found { ['addr1'] = true, ... }

-- 1. Fetch all comment hashes based on IDs
redis.call('MULTI')
for i = 1, #commentIdsWithScores, 2 do
    local commentId = commentIdsWithScores[i]
    redis.call('HGETALL', 'comment:' .. commentId)
end
local commentHashes = redis.call('EXEC')

-- 2. Process comment hashes, extract addresses, prepare user detail keys
local commentIndex = 1
for i = 1, #commentIdsWithScores, 2 do
    local commentId = commentIdsWithScores[i]
    local score = commentIdsWithScores[i+1] -- Timestamp as string
    local hashData = commentHashes[commentIndex]
    commentIndex = commentIndex + 1

    local commentInfo = {}
    local address = ''
    if #hashData > 0 then
        for j = 1, #hashData, 2 do
            commentInfo[hashData[j]] = hashData[j+1]
            if hashData[j] == 'address' then
                address = hashData[j+1]
            end
        end
        commentInfo.createdTime = tonumber(score) -- Add timestamp from ZSET score
        commentInfo.id = commentId -- Add the comment ID
        commentDataMap[commentId] = commentInfo

        -- If address found and not already marked for fetching
        if address ~= '' and not addressesFound[address] then
            table.insert(userDetailKeysToFetch, 'user:' .. address .. ':details')
            addressesFound[address] = true
        end
    end
end

-- 3. Fetch user details for all unique addresses found
local userDetailsMap = {} -- { ['user:addr:details'] -> { userData } }
if #userDetailKeysToFetch > 0 then
    redis.call('MULTI')
    for _, userKey in ipairs(userDetailKeysToFetch) do
        redis.call('HGETALL', userKey)
    end
    local userHashes = redis.call('EXEC')

    for k, userKey in ipairs(userDetailKeysToFetch) do
        local userHashData = userHashes[k]
        local userDetail = {}
        if #userHashData > 0 then
            for j = 1, #userHashData, 2 do
                userDetail[userHashData[j]] = userHashData[j+1]
            end
        end
        userDetailsMap[userKey] = userDetail
    end
end

-- 4. Combine comment data with user details
for i = 1, #commentIdsWithScores, 2 do
    local commentId = commentIdsWithScores[i]
    local commentInfo = commentDataMap[commentId]

    if commentInfo then -- Check if comment data was successfully retrieved
        local address = commentInfo.address
        local userKey = 'user:' .. address .. ':details'
        local userInfo = userDetailsMap[userKey] or {} -- Default to empty table if user details not found

        -- Add default/fallback logic for display name and pfp
        local displayName = userInfo.displayName or ('...' .. string.sub(address, -5))
        local pfpUrl = userInfo.pfpUrl -- Frontend handles missing pfp

        table.insert(results, {
            id = commentId, -- Include comment ID
            address = address,
            comment = commentInfo.comment,
            createdTime = commentInfo.createdTime,
            blogId = commentInfo.blogId,
            -- parentId = commentInfo.parentId, -- Include if needed later
            displayName = displayName,
            pfpUrl = pfpUrl
        })
    end
end

return cjson.encode(results) -- Return results as a JSON string
`;

/**
 * Fetches blog comments with associated user details
 *
 * @param redis Redis client
 * @param blogId Blog ID to fetch comments for
 * @param start Start index for pagination (default: 0)
 * @param count Number of comments to fetch (default: 20)
 * @returns Promise resolving to an array of comments with user details and pagination info
 */
export async function fetchBlogComments(
    redis: Redis,
    blogId: string,
    start: number = 0,
    count: number = 20
): Promise<{
    comments: CommentWithUserDetails[];
    pagination: {
        start: number;
        count: number;
        total: number;
    };
}> {
    if (!blogId || typeof blogId !== "string") {
        throw new Error("Invalid blogId");
    }

    const end = start + count - 1;
    const blogCommentsKey = `blog:${blogId}:comments`;

    // Step 1: Get comment IDs with scores (timestamps) using ZREVRANGE
    // This gets elements in reverse order (newest first)
    const commentIdsWithScores = await redis.zrevrange(blogCommentsKey, start, end, "WITHSCORES");

    // Step 2: Prepare to fetch comment data and collect unique addresses
    const commentIds: string[] = [];
    const commentScores: { [commentId: string]: number } = {};

    // Process the ZRANGE result (alternating commentId and score)
    for (let i = 0; i < commentIdsWithScores.length; i += 2) {
        const commentId = commentIdsWithScores[i];
        const score = parseInt(commentIdsWithScores[i + 1]);
        commentIds.push(commentId);
        commentScores[commentId] = score;
    }

    if (commentIds.length === 0) {
        // No comments found, return empty result
        const total = await redis.zcard(blogCommentsKey);
        return {
            comments: [],
            pagination: { start, count, total },
        };
    }

    // Step 3: Fetch all comment data using pipeline
    const pipeline = redis.pipeline();
    commentIds.forEach((commentId) => {
        pipeline.hgetall(`comment:${commentId}`);
    });

    const commentDataResults = await pipeline.exec();

    // Step 4: Process comment data and collect unique addresses
    const commentDataMap: { [commentId: string]: CommentWithUserDetails } = {};
    const uniqueAddresses = new Set<string>();

    commentIds.forEach((commentId, index) => {
        // commentDataResults format is [error, result][]
        const commentData = commentDataResults?.[index]?.[1] as BasicComment;
        console.log(commentData);

        if (commentData && Object.keys(commentData).length > 0) {
            // Add the commentId and timestamp to the data
            const address = commentData.address;
            if (address) {
                const partialCommentWithDetails: CommentWithUserDetails = {
                    ...commentData,
                    displayName: address.slice(-5),
                    id: commentId,
                    createdTime: parseInt(commentData.createdTime),
                };
                commentDataMap[commentId] = partialCommentWithDetails;
                // Collect unique addresses for user details lookup
                uniqueAddresses.add(address);
            }
        }
    });

    // Step 5: Fetch user details for all unique addresses
    const userDetailsPipeline = redis.pipeline();
    const addressArray = Array.from(uniqueAddresses);

    addressArray.forEach((address) => {
        userDetailsPipeline.hgetall(`user:${address}:details`);
    });

    const userDetailsResults = await userDetailsPipeline.exec();

    // Step 6: Create a map of address to user details
    const userDetailsMap: { [address: string]: UserRemoteInfo } = {};

    addressArray.forEach((address, index) => {
        const userDetails = userDetailsResults?.[index]?.[1] as UserRemoteInfo;
        userDetailsMap[address] = userDetails || {};
    });

    // Step 7: Combine comment data with user details
    const comments: CommentWithUserDetails[] = commentIds
        .map((commentId) => {
            const commentData = commentDataMap[commentId];
            if (!commentData) return null;

            const address = commentData.address;
            const userDetails = userDetailsMap[address] || {};

            // Create the combined comment with user details
            return {
                id: commentId,
                address,
                comment: commentData.comment,
                createdTime: commentData.createdTime,
                blogId: commentData.blogId,
                // Add default/fallback logic for display name
                displayName: userDetails.displayName || `${address.slice(-5)}`,
                // Include pfpUrl if available
                ...(userDetails.pfpUrl && { pfpUrl: userDetails.pfpUrl }),
            };
        })
        .filter(Boolean) as CommentWithUserDetails[];
    console.log(comments);

    // Get the total count of comments for this blog
    const total = await redis.zcard(blogCommentsKey);

    return {
        comments,
        pagination: {
            start,
            count,
            total,
        },
    };
}
