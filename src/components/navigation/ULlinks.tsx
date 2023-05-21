import Link from "next/link";
import { ULHorizontalLinkType } from "@utils/types/navigation";

type ULHorizontalInternalLinksProps = {
	linkMap: ULHorizontalLinkType[];
	isInternalLink?: boolean;
};

export const ULHorizontalLinks: React.FunctionComponent<ULHorizontalInternalLinksProps> = ({
	...props
}) => {
	const { linkMap, isInternalLink = false } = props;
	return (
		<ul className="list-none">
			{linkMap.map((link: ULHorizontalLinkType, index) => (
				<li
					key={index}
					className="text-lg inline pr-8 text-coral-300 font-bold no-underline"
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
