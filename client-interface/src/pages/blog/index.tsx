import { posts } from "@constants";
import Link from "next/link";
import React from "react";

const Blog: React.FunctionComponent = () => {
    const allPosts = Object.entries(posts).sort(([a, aData], [b, bData]) => {
        const dateA = aData.firstDrafted.getDate();
        const dateB = bData.firstDrafted.getDate();
        // return the latest post first
        return dateB - dateA;
    });
    return (
        <div className="flex h-full flex-col gap-2 p-8 overflow-hidden">
            <div className="flex flex-col gap-4">
                <h4>
                    <Link href="/">@jz-dot-meng</Link>
                </h4>
                <div className="flex items-start flex-col gap-1 md:items-end md:flex-row">
                    <h1>blogs</h1>
                    <span className="pb-2"> :: a collection of thoughts</span>
                </div>
            </div>
            <div className="flex flex-col gap-4 overflow-y-scroll no-scrollbar">
                {allPosts.map(([slug, postData], index) => (
                    <Link
                        className="flex flex-col py-12 justify-center"
                        href={`/blog/post/${slug}`}
                        key={slug}
                    >
                        <h2 className="text-xl">{postData.title}</h2>
                        <p className="text-white">{postData.description}</p>
                        <p className="text-xs text-grey-600">
                            {postData.firstDrafted.toDateString()}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
};
export default Blog;
