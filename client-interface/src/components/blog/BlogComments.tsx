import { GameButton } from "@components/common/buttons/GameButton";
import { Identicon } from "@utils/functions/identicon";
import { ErrorResponse } from "@utils/types/api";
import { CommentWithUserDetails } from "data-cache";
import { DataCacheFrontend } from "data-cache/frontend";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useUserContext } from "../../context/UserContext";
import { AddCommentResponse, BlogCommentsResponse } from "../../utils/types/blog";
import { api } from "../../utils/wrappers/api";

interface BlogCommentsProps {
    blogId: string;
}

export const BlogComments: React.FC<BlogCommentsProps> = ({ blogId }) => {
    const { user } = useUserContext();

    const [comments, setComments] = useState<CommentWithUserDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Function to fetch comments
    const fetchComments = async () => {
        if (!blogId) return;

        setIsLoading(true);
        setError(null);

        try {
            // Prepare the command parameters
            const params = {
                blogId,
                // Optional pagination parameters could be added here
            };

            // Use DataCacheFrontend to generate the payload
            // We can use an empty user object for public data
            if (!user?.privateKey) return;

            const signedPayload = DataCacheFrontend.handleFetchBlogComments(user, params);

            // Use the api wrapper to send the request with the correct type
            const result = await api<BlogCommentsResponse | ErrorResponse>(
                "/api/command",
                signedPayload
            );

            if (result.success === false) {
                throw new Error(result.error || "Failed to fetch comments");
            }

            console.log(result);

            // Update the comments state
            if (result.data.comments.length > 0) setComments(result.data.comments);
        } catch (err: unknown) {
            console.error("Error fetching comments:", err);
            setError("Failed to fetch comments");
            toast.error("Failed to fetch comments");
        } finally {
            setIsLoading(false);
        }
    };

    // Function to submit a new comment
    const submitComment = async () => {
        if (!user) {
            toast.error("Unable to find your details...");
            return;
        }

        if (!newComment.trim()) {
            toast.error("Comment cannot be empty");
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare the command parameters
            const params = {
                blogId,
                comment: newComment.trim(),
            };

            // Use DataCacheFrontend to generate the payload
            const signedPayload = DataCacheFrontend.handleAddBlogComment(user, params);

            // Use the api wrapper to send the request with the correct type
            const result = await api<AddCommentResponse | ErrorResponse>(
                "/api/command",
                signedPayload
            );

            if (result.success === false) {
                throw new Error(result.error || "Failed to add comment");
            }

            // Clear the comment input
            setNewComment("");

            // Show success message
            toast.success("Comment added successfully");

            // Refresh the comments list
            fetchComments();
        } catch (err: unknown) {
            console.error("Error adding comment:", err);
            toast.error("Failed to add comment");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fetch comments when the component mounts or blogId changes
    useEffect(() => {
        fetchComments();
    }, []);

    // Format timestamp to a readable date
    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString();
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="text-center text-xs">***</div>
            <h2 className="text-xl">Comments</h2>

            {/* Comment form */}
            <div className="flex flex-col gap-2">
                <textarea
                    className="form-control w-full p-2 border border-gray-300 rounded-md bg-grey-800 text-white"
                    rows={4}
                    placeholder={"Add a comment..."}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={!user || isSubmitting}
                />
                <div className="flex">
                    <GameButton
                        onClick={submitComment}
                        buttonText={isSubmitting ? "Submitting" : "Submit"}
                        disabled={!user || isSubmitting || newComment.trim() === ""}
                    />
                </div>
            </div>

            {/* Comments list */}
            <div className="flex flex-col gap-4">
                {isLoading ? (
                    <p>Loading comments...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : comments.length === 0 ? (
                    <p>No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex flex-col gap-1 p-3">
                            <div className="flex items-center gap-2">
                                {/* User avatar */}
                                <div className="w-8 h-8 rounded-full overflow-hidden p-1 bg-white">
                                    <Image
                                        alt={"pfp"}
                                        src={
                                            comment.pfpUrl ||
                                            `data:image/svg+xml;base64,${new Identicon(
                                                comment.address
                                            ).toString()}`
                                        }
                                        width={24}
                                        height={24}
                                    />
                                </div>

                                {/* User name and timestamp */}
                                <div className="flex flex-col">
                                    <span className="font-semibold">{comment.displayName}</span>
                                    <span className="text-xs text-gray-400">
                                        {formatDate(comment.createdTime)}
                                    </span>
                                </div>
                            </div>

                            {/* Comment text */}
                            <p className="mt-2 whitespace-pre-wrap">{comment.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
