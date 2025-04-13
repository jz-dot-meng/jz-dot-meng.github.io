export interface BasicComment {
    address: string;
    comment: string;
    createdTime: string;
    blogId: string;
}

/**
 * Interface representing a comment with associated user details
 */
export interface CommentWithUserDetails {
    id: string;
    address: string;
    comment: string;
    createdTime: number;
    blogId: string;
    displayName: string;
    pfpUrl?: string;
}

export type BlogComments = {
    comments: CommentWithUserDetails[];
    pagination: {
        start: number;
        count: number;
        total: number;
    };
};
