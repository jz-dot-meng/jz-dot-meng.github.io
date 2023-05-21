import { BlogData } from "@utils/types/blog";
import { HorizontalLinkType } from "@utils/types/navigation";

export const gamesLinkMap: HorizontalLinkType[] = [
	{ url: "/minigame/memory", name: "Memory" },
	{ url: "/minigame/stroop", name: "Stroop Effect" },
];

export const posts: Record<string, BlogData> = {
	"digital-identities-and-impermanence": {
		title: "digital identities, and impermanence",
		secondaryTitle: "a reflection, and new beginnings",
		description: "a short post explaining the reasoning for this new project",
		firstPosted: new Date(2023, 4, 21), // remembering that month is zero indexed
		tags: ["blogging"],
	},
};
