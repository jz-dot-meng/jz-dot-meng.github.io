import { BlogData } from "@utils/types/blog";
import Link from "next/link";
import { ReactNode } from "react";

interface BlogWrapperProps {
    data: BlogData;
    children: ReactNode;
}
export const BlogWrapper: React.FunctionComponent<BlogWrapperProps> = ({ data, children }) => {
    return (
        <div className="flex justify-center h-full p-8 overflow-y-scroll no-scrollbar">
            <div className="flex flex-col gap-2">
                <section className="flex flex-col gap-4">
                    <h4>
                        <Link href="/">@jz-dot-meng</Link>
                    </h4>
                    <div className="flex items-start flex-col gap-1 md:items-end md:flex-row">
                        <h1>{data.title}</h1>
                        {data.secondaryTitle && (
                            <span className="pb-2"> :: {data.secondaryTitle}</span>
                        )}
                    </div>
                    <div className="text-xs md:text-sm flex flex-col gap-1">
                        <p>first drafted: {data.firstDrafted.toDateString()}</p>
                        {data.lastEdited && (
                            <p className="italic text-grey-600">
                                last edited: {data.lastEdited.toDateString()}
                            </p>
                        )}
                    </div>
                    {data.tags.length > 0 && (
                        <div>
                            <span className="text-grey-600 text-xs">tags:</span>{" "}
                            {data.tags.map((tag, index) => (
                                <span key={index}>
                                    <Link href={"/blog"}>{tag}</Link>
                                    {index !== data.tags.length - 1 && ", "}
                                </span>
                            ))}
                        </div>
                    )}
                </section>
                <section className="py-8 flex flex-col gap-4">{children}</section>
                <footer className="text-xs pb-8">
                    <Link href={"/blog"}>← Return to blogs</Link>
                </footer>
            </div>
        </div>
    );
};
