/**
 * Defines the valid command names used for interactions.
 */
export const ActionCommands = {
    UPDATE_USER_DETAILS: "updateUserDetails",
    ADD_BLOG_COMMENT: "addBlogComment",
    FETCH_BLOG_COMMENTS: "fetchBlogComments",
    // UPDATE_GAME_SCORE: "updateGameScore", // Example for future
} as const; // Use 'as const' for stricter typing

// Type representing the possible command values
export type ActionCommand = (typeof ActionCommands)[keyof typeof ActionCommands];

/**
 * Defines the expected parameter structure for the "updateUserDetails" command.
 */
export interface UpdateUserDetailsParams {
    displayName?: string;
    pfpUrl?: string;
    // Add other user details fields here as needed in the future
}

// Add interfaces for other command parameters here later
/**
 * Defines the expected parameter structure for the "addBlogComment" command.
 */
export interface AddBlogCommentParams {
    blogId: string;
    comment: string;
}

/**
 * Defines the expected parameter structure for the "fetchBlogComments" command.
 */
export interface FetchBlogCommentsParams {
    blogId: string;
    start?: number; // Starting index for pagination
    count?: number; // Number of comments to fetch
}
// export interface UpdateGameScoreParams { ... }
