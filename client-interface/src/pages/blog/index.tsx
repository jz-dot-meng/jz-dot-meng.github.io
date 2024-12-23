import { Header } from "@components/common/header/Header";
import { posts } from "@constants";
import Link from "next/link";
import React from "react";

const Blog: React.FunctionComponent = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const allPosts = Object.entries(posts).sort(([_a, aData], [_b, bData]) => {
        const dateA = aData.firstDrafted.getDate();
        const dateB = bData.firstDrafted.getDate();
        // return the latest post first
        return dateB - dateA;
    });
    return (
        <div className="flex h-full flex-col gap-2 p-8 overflow-hidden">
            <section className="flex flex-col gap-4">
                <Header />
                <div className="flex items-start flex-col gap-1 md:items-end md:flex-row">
                    <h1>blogs</h1>
                    <span className="pb-2"> :: a collection of thoughts</span>
                </div>
            </section>
            <section className="flex flex-col gap-4 overflow-y-scroll no-scrollbar">
                {allPosts.map(([slug, postData]) => (
                    <Link
                        className="flex flex-col py-4 justify-center"
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
            </section>
        </div>
    );
};
export default Blog;
