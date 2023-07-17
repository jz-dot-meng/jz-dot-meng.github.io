import { DevFooter } from "@components/navigation/DevFooter";
import { HorizontalLinks } from "@components/navigation/HorizontalLinks";
import { toolsLinkMap } from "@constants";
import Link from "next/link";
import React, { ReactNode } from "react";

interface ToolWrapperProps {
    title: string;
    secondaryTitle?: string;
    children: ReactNode;
}
export const ToolWrapper: React.FunctionComponent<ToolWrapperProps> = ({
    title,
    secondaryTitle,
    children,
}) => {
    return (
        <div className="flex justify-center items-center h-full p-8 overflow-y-scroll no-scrollbar">
            <div className="flex flex-col gap-2 w-3/4 md:w-1/2">
                <section className="flex flex-col gap-4">
                    <h4>
                        <Link href="/">@jz-dot-meng</Link>
                    </h4>
                    <div className="flex items-start flex-col gap-1 md:items-end md:flex-row">
                        <h1>{title}</h1>
                        {secondaryTitle && <span className="pb-2"> :: {secondaryTitle}</span>}
                    </div>
                    <HorizontalLinks linkMap={toolsLinkMap} isInternalLink />
                </section>
                <section className="py-8 flex flex-col gap-4">{children}</section>
                <DevFooter />
            </div>
        </div>
    );
};
