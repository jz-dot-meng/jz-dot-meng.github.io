import Link from "next/link";
import { HorizontalLinkType } from "@utils/types/navigation";

type HorizontalLinksProps = {
    linkMap: HorizontalLinkType[];
    isInternalLink?: boolean;
};

export const HorizontalLinks: React.FunctionComponent<HorizontalLinksProps> = ({ ...props }) => {
    const { linkMap, isInternalLink = false } = props;
    return (
        <ul className="list-none">
            {linkMap.map((link: HorizontalLinkType, index) => (
                <li
                    key={index}
                    className="text-lg inline pr-8 text-coral-400 font-bold no-underline"
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
