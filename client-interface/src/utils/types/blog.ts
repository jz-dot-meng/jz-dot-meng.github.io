import { BlogComments } from "data-cache";
import { SuccessResponse } from "./api";

export type BlogData = {
    id: string;
    title: string;
    secondaryTitle?: string;
    description: string;
    firstDrafted: Date;
    lastEdited?: Date;
    tags: string[];
};

export interface BlogCommentsResponse extends SuccessResponse {
    success: true;
    data: BlogComments;
}

export interface AddCommentResponse extends SuccessResponse {
    success: true;
    data: { commentId?: string };
}
