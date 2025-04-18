import { HorizontalLinkType } from "@utils/types/navigation";
import Link from "next/link";
import React from "react";

type HorizontalLinksProps = {
    linkMap: HorizontalLinkType[];
    isInternalLink?: boolean;
};

export const HorizontalLinks: React.FunctionComponent<HorizontalLinksProps> = ({ ...props }) => {
    const { linkMap, isInternalLink = false } = props;
    return (
        <ul className="list-none flex flex-col md:flex-row md:flex-nowrap md:overflow-x-auto no-scrollbar">
            {linkMap.map((link: HorizontalLinkType, index) => (
                <li
                    key={index}
                    className="text-lg inline pr-8 text-coral-400 font-bold no-underline whitespace-nowrap"
                >
                    {isInternalLink ? (
                        <Link href={link.url}>{link.name}</Link>
                    ) : (
                        <a href={link.url}>{link.name}</a>
                    )}
                </li>
            ))}
        </ul>
    );
};
