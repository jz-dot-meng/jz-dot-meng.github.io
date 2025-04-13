import { BlogData } from "../utils/types/blog";
import { HorizontalLinkType } from "../utils/types/navigation";

export const gamesLinkMap: HorizontalLinkType[] = [
    { url: "/minigame/memory", name: "memory" },
    { url: "/minigame/stroop", name: "stroop effect" },
];

export const toolsLinkMap: HorizontalLinkType[] = [
    { url: "/tools/lowercase-me", name: "lowercase me" },
    { url: "/tools/hex-to-number", name: "hex to number" },
    { url: "/tools/rust-formatter", name: "rust formatter" },
];

export const posts: Record<string, BlogData> = {
    "exploring-digital-identities-a-plan": {
        id: "exploring-digital-identities-a-plan",
        title: "exploring digital identities - a plan",
        secondaryTitle: "creating an online social space",
        description: "the start of a deep dive into cryptography",
        firstDrafted: new Date(2023, 4, 25),
        tags: ["project"],
    },
    "digital-identities-and-impermanence": {
        id: "digital-identities-and-impermanence",
        title: "digital identities, and impermanence",
        secondaryTitle: "a reflection, and new beginnings",
        description: "a short post explaining the reasoning for this new project",
        firstDrafted: new Date(2023, 4, 21), // remembering that month is zero indexed
        tags: ["blogging"],
    },
};
